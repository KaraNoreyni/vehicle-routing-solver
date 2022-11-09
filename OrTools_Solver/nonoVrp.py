
# [START import]
import functools
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from data import define_data
# [END import]
#TODO try to make callback that ommit depot start a,d end to define 
# vehicle shift because with original dimesion we cant touch to slack 
# and and max time  
class StopBuilder():
    """Pattern for stop objects make them easy to be constructed"""
    def __init__(self, manager, routing, dimensions, assignment, data):
        self.pattern = {}
        self.arrivalPattern = {}
        self.arrivalPattern['activity'] = 'Arrival'
        self.pattern['activity'] = {}
        self.pattern['index'] = manager.IndexToNode
        self.pattern['activity']['index'] = functools.partial(
            self.getNextIndex, assignment, manager, routing)

        if 'Time' in dimensions:
            self.arrivalPattern['arrival_time'] = functools.partial(
                self.getCumulVar, dimensions['Time'], assignment)
            self.pattern['arrival_time'] = functools.partial(
                self.getCumulVar, dimensions['Time'], assignment)
            self.pattern['activity']['departure_time'] = functools.partial(
                self.getDepartureTime, dimensions['Time'], 
                manager, assignment, data)
            self.pattern['activity']['travel_time'] = functools.partial(
                self.getTransitVar, dimensions['Time'], assignment)
            self.pattern['activity']['slack_time'] = functools.partial(
                self.getSlackVar, dimensions['Time'], assignment)
        if 'Autonomy' in dimensions:
            self.arrivalPattern['autonomy'] = functools.partial(
                self.getCumulVar, dimensions['Autonomy'], assignment)
            self.pattern['activity']['travel_distance'] = functools.partial(
                self.getTransitVar, dimensions['Autonomy'], assignment)
    
    def makeArrivalStop(self, arrivalPattern ,index):
        stop = {}
        for key, value in arrivalPattern.items():
            if callable(value):
                stop[key] = value(index)
            else :
                stop[key] = value
        return stop 
    def makeStop(self, pattern, index):
        """obj must be {}"""
        stop = {}
        for key, value in pattern.items():
            if callable(value):
                stop[key] = value(index)
            else:
                stop[key] = self.makeStop(pattern[key], index)
        return stop 
    def getDepartureTime(self, dimension, manager, assignment, data, index):
        if 'service_time' in data:
            if manager.IndexToNode(index) in data['service_time']:
                return assignment.Value(
                    dimension.CumulVar(index)) + data[
                        'service_time'][manager.IndexToNode(index)]
        return assignment.Value(
                    dimension.CumulVar(index))
    def getNextIndex(self, assignment, manager, routing, index):
        return manager.IndexToNode(
            assignment.Value(routing.NextVar(index)))
    def getSlackVar(self, dimension, assignment, index):
        return assignment.Value(
            dimension.SlackVar(index))
    def getTransitVar(self, dimension, assignment, index):
        return assignment.Value(
            dimension.TransitVar(index))
    def getCumulVar(self, dimension, assignment, index):
        return assignment.Value(
            dimension.CumulVar(index))
class RouteStatisticBuilder():
    def __init__(self, dimensions):
        self.pattern = {}
        self.pattern['statistics'] = {}
        self.pattern['statistics']['num_locations'] = self.getNumStops
        if 'Time' in dimensions:
            self.pattern['statistics']['total_travel_time'] = self.getTotalTravelTime
            self.pattern['statistics']['total_waiting'] = self.getTotalTimeSlack
            self.pattern['statistics']['shift_start'] = self.getShiftStart
            self.pattern['statistics']['shift_end'] = self.getShiftEnd
            self.pattern['statistics']['shift_duration'] = self.getShiftTime
        if 'Autonomy' in dimensions:
            self.pattern['statistique']['total_travel_distance'] = self.getTotalTravelDistance
    def buildRouteStatistic(self, pattern, stops):
        stat = {}
        for key, value in pattern.items():
            if callable(value):
                stat[key] = value(stops)
        return {
            'statistics': stat,
            'stops': stops
        }
    def getTotalTravelDistance(self, stops):
        return stops[-1]['autonomy']
    def getShiftTime(self, stops):
        return stops[-1]['arrival_time'] - stops[0]['arrival_time'] 
    def getShiftStart(self, stops):
        return stops[0]['arrival_time']
    def getShiftEnd(self, stops):
        return stops[-1]['arrival_time']
    def getTotalTravelTime(self, stops):
        travel_time = int(0)
        for stop in stops:
            if stops[-1] == stop:
                continue
            _travel_time = stop['activity']['travel_time']
            travel_time += _travel_time
        return travel_time
    def getTotalTimeSlack(self, stops):
        total_slack = int(0)
        for stop in stops:
            if stops[-1] == stop:
                continue
            _total_slack = stop['activity']['slack_time']
            total_slack += _total_slack
        return total_slack
    def getNumStops(self, stops):
        return len(stops)
class Solver():
    def __init__(self, data):
        self.data = data
        self.manager = pywrapcp.RoutingIndexManager(
            len(data['distance_matrix']), data['num_vehicles'], 
                data['depot'])
        self.routing = pywrapcp.RoutingModel(self.manager)
        self.dimensions = {}
        if 'distance_matrix' in self.data:
            distance_callback_index = self.registerDistanceCallback()
            self.routing.SetArcCostEvaluatorOfAllVehicles(distance_callback_index)
            if 'autonomy' in self.data:
                self.add_autonomy_constraint(distance_callback_index)
        if 'duration_matrix' in self.data:
            time_callback_index = self.registerTimeCallback()
            if 'time_windows' in self.data:
                self.add_time_window_constraints(time_callback_index)
    def solve(self):
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)  # pylint: disable=no-member
        search_parameters.local_search_metaheuristic = (
            routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH)
        search_parameters.time_limit.FromSeconds(3)
        # [END parameters]
        # Solve the problem.
        # [START solve]
        assignment = self.routing.SolveWithParameters(search_parameters)
        if assignment:
            stop_builder = StopBuilder(self.manager, self.routing, self.dimensions, assignment, self.data)
            route_builder = RouteStatisticBuilder(self.dimensions)
            solution = []
            for vehicle_id in range(self.data['num_vehicles']):
                route = []
                index = self.routing.Start(vehicle_id)
                while not self.routing.IsEnd(index):
                    stop = stop_builder.makeStop(stop_builder.pattern, index)
                    route.append(stop)
                    index = assignment.Value(self.routing.NextVar(index))
                stop = stop_builder.makeArrivalStop(stop_builder.arrivalPattern, index)
                route.append(stop)
                _route = route_builder.buildRouteStatistic(route_builder.pattern['statistics'], route)
                solution.append(_route)
            print(solution)
        else:
            print('No solution found!')
    def registerDistanceCallback(self):
        distance_callback_index = self.routing.RegisterTransitCallback(
            self.distance_callback)
        return distance_callback_index

    def registerTimeCallback(self):
        time_callback_index = self.routing.RegisterTransitCallback(
            self.time_callback)
        return time_callback_index
    def distance_callback(self, from_index, to_index):
        """Returns the distance between the two nodes."""
        # Convert from routing variable Index to distance matrix NodeIndex.
        from_node = self.manager.IndexToNode(from_index)
        to_node = self.manager.IndexToNode(to_index)
        return self.data['distance_matrix'][from_node][to_node]
    # [END transit_callback]

    def time_callback(self, from_index, to_index):
        """Returns the travel time between the two nodes."""
        # Convert from routing variable Index to time matrix NodeIndex.
        from_node = self.manager.IndexToNode(from_index)
        to_node = self.manager.IndexToNode(to_index)
        if 'service_duration' in self.data and from_index in self.data['service_duration']:
            return self.data['duration_matrix'][from_node][to_node] + self.data['service_duration'][from_node]
        return self.data['duration_matrix'][from_node][to_node]

    # Add distance constraint.
    # [START distance_constraint]
    def add_autonomy_constraint(self, distance_callback_index):
        autonomy = 'Autonomy'
        self.routing.AddDimension(
            distance_callback_index,
            0,  # null autonomy slack
            self.data['autonomy'],
            True,  # start cumul to zero
            autonomy)
        autonomy_dimension = self.routing.GetDimensionOrDie(autonomy)
        self.dimensions[autonomy] = autonomy_dimension
        for idx, _ in enumerate(self.data['distance_matrix']):
            index = self.manager.NodeToIndex(idx)
            self.routing.AddToAssignment(autonomy_dimension.TransitVar(index))
    def add_time_window_constraints(self, time_callback_index):
        """Add Global Span constraint."""
        time = 'Time'
        self.routing.AddDimension(
            time_callback_index,
            36000,  # allow waiting time
            36000,  # maximum time per vehicle
            False,  # Don't force start cumul to zero.
            time)
        time_dimension = self.routing.GetDimensionOrDie(time)
        # Store in dimensions
        self.dimensions[time] = time_dimension
        # time_dimension.SetGlobalSpanCostCoefficient(100)
        # Add time window constraints for each location except depot.
        for location_idx, time_window in enumerate(self.data['time_windows']):
            if location_idx == self.data['depot']:
                continue
            index = self.manager.NodeToIndex(location_idx)
            time_dimension.CumulVar(index).SetRange(time_window[0], time_window[1])
            time_dimension.SlackVar(index).SetMax(self.data['max_waiting'])
            self.routing.AddToAssignment(time_dimension.TransitVar(index))
            self.routing.AddToAssignment(time_dimension.SlackVar(index))
        # Add time window constraints for each vehicle start node
        # and 'copy' the slack var in the solution object (aka Assignment) to print it
        for vehicle_id in range(self.data['num_vehicles']):
            index = self.routing.Start(vehicle_id)
            time_dimension.CumulVar(index).SetRange(
                self.data['time_windows'][0][0],
                self.data['time_windows'][0][1])
            time_dimension.SlackVar(index).SetValue(0)              
            self.routing.AddToAssignment(time_dimension.SlackVar(index))
            self.routing.AddToAssignment(time_dimension.TransitVar(index))
            # The time window at the end node was impliclty set in the time dimension
            # definition to be [0, horizon].
            # Warning: Slack var is not defined for vehicle end nodes and should not
            # be added to the assignment.
def solve():
# Instantiate the data problem.
    data = define_data()
    solver = Solver(data)
    solver.solve()
if __name__ == '__main__':
    solve()