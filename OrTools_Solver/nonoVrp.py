
# [START import]
import functools
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from data import define_data
# [END import]
#TODO try to make callback that ommit depot start a,d end to define 
# vehicle shift because with original dimesion we cant touch to slack 
# and and max time  
def travel_callback(manager, data, from_index, to_index):
    """Returns the travel time between the two nodes."""
    # Convert from routing variable Index to time matrix NodeIndex.
    if from_index == data["depot"] or to_index == data["depot"]:
        return 0
    from_node = manager.IndexToNode(from_index)
    to_node = manager.IndexToNode(to_index)
    return data['duration_matrix'][from_node][to_node] + 450


def add_travel_constraints(routing, manager, data, time_callback_index):
    """Add Global Span constraint."""
    travel = 'Travel'
    routing.AddDimension(
        time_callback_index,
        0,  # allow waiting time
        3600*4,  # maximum time per vehicle
        True,  # Force start cumul to zero.
        travel)
    travel_dimension = routing.GetDimensionOrDie(travel)
    time_dimension = routing.GetDimensionOrDie('Time')
    # Add time window constraints for each location except depot.
    for location_idx, time_window in enumerate(data['time_windows']):
        index = manager.NodeToIndex(location_idx)
        slack_var = time_dimension.SlackVar(index).Value()
        initial_value = travel_dimension.CumulVar(index).Value()
        travel_dimension.CumulVar(index).SetValue(initial_value+slack_var)
    # Add time window constraints for each vehicle start node
    # and 'copy' the slack var in the solution object (aka Assignment) to print it
    for vehicle_id in range(data['num_vehicles']):
        index = routing.Start(vehicle_id)
        travel_dimension.CumulVar(index).SetMax(3600*4)
        # The time window at the end node was impliclty set in the time dimension
        # definition to be [0, horizon].
        # Warning: Slack var is not defined for vehicle end nodes and should not
        # be added to the assignment.


def time_callback(manager, data, from_index, to_index):
    """Returns the travel time between the two nodes."""
    # Convert from routing variable Index to time matrix NodeIndex.
    from_node = manager.IndexToNode(from_index)
    to_node = manager.IndexToNode(to_index)
    return data['duration_matrix'][from_node][to_node] + 300

def add_time_window_constraints(routing, manager, data, time_callback_index):
    """Add Global Span constraint."""
    time = 'Time'
    routing.AddDimension(
        time_callback_index,
        36000,  # allow waiting time
        36000,  # maximum time per vehicle
        False,  # Don't force start cumul to zero.
        time)
    time_dimension = routing.GetDimensionOrDie(time)
    # time_dimension.SetGlobalSpanCostCoefficient(100)
    # Add time window constraints for each location except depot.
    for location_idx, time_window in enumerate(data['time_windows']):
        if location_idx == data['depot']:
            continue
        index = manager.NodeToIndex(location_idx)
        time_dimension.CumulVar(index).SetRange(time_window[0], time_window[1])
        time_dimension.SlackVar(index).SetMax(120)
        routing.AddToAssignment(time_dimension.TransitVar(index))
        routing.AddToAssignment(time_dimension.SlackVar(index))
    # Add time window constraints for each vehicle start node
    # and 'copy' the slack var in the solution object (aka Assignment) to print it
    for vehicle_id in range(data['num_vehicles']):
        index = routing.Start(vehicle_id)
        time_dimension.CumulVar(index).SetRange(data['time_windows'][0][0],
                                                data['time_windows'][0][1])
        time_dimension.SlackVar(index).SetValue(0)              
        routing.AddToAssignment(time_dimension.SlackVar(index))
        routing.AddToAssignment(time_dimension.TransitVar(index))
        # The time window at the end node was impliclty set in the time dimension
        # definition to be [0, horizon].
        # Warning: Slack var is not defined for vehicle end nodes and should not
        # be added to the assignment.

def distance_callback(manager, data, from_index, to_index):
    """Returns the distance between the two nodes."""
    # Convert from routing variable Index to distance matrix NodeIndex.
    from_node = manager.IndexToNode(from_index)
    to_node = manager.IndexToNode(to_index)
    return data['distance_matrix'][from_node][to_node]
# [END transit_callback]

# Add distance constraint.
# [START distance_constraint]
def add_autonomy_constraint(routing, distance_callback_index):
    autonomy = 'Autonomy'
    routing.AddDimension(
        distance_callback_index,
        0,  # null autonomy slack
        100000,
        True,  # start cumul to zero
        autonomy)
 

# [START solution_printer]
# [START solution_printer]
def print_solution(data, manager, routing, assignment):  # pylint:disable=too-many-locals
    """Prints assignment on console."""
    print('Objective: {}'.format(assignment.ObjectiveValue()))
    total_distance = 0
    total_time = 0
    time_dimension = routing.GetDimensionOrDie('Time')
    for vehicle_id in range(data['num_vehicles']):
        index = routing.Start(vehicle_id)
        plan_output = 'Route for vehicle {}:\n'.format(vehicle_id)
        distance = 0
        travel_time = 0
        while not routing.IsEnd(index):
            time_var = time_dimension.CumulVar(index)
            slack_var = time_dimension.SlackVar(index)
            transit_var = time_dimension.TransitVar(index)
            plan_output += ' {0} Time({1}) Slack({2}) transit({3}) ->'.format(
                manager.IndexToNode(index),
                assignment.Value(time_var),
                assignment.Value(slack_var),
                assignment.Value(transit_var))
            travel_time += assignment.Value(transit_var)
                
            previous_index = index
            index = assignment.Value(routing.NextVar(index))
            distance += routing.GetArcCostForVehicle(previous_index, index,
                                                     vehicle_id)
        time_var = time_dimension.CumulVar(index)
        plan_output += ' {0} Time({1})\n'.format(
            manager.IndexToNode(index),assignment.Value(time_var))
        plan_output += 'Distance of the route: {0}m\n'.format(distance)
        plan_output += 'Travel time of the route: {}\n'.format(travel_time)
        print(plan_output)
        total_distance += distance
        total_time += travel_time
    print('Total Distance of all routes: {0}m'.format(total_distance))
    print('Total Travel time of all routes: {0}s'.format(total_time))
    # [END solution_printer]

def solve():
# Instantiate the data problem.
    # [START data]
    data = define_data()
    # [END data]
    
    # Create the routing index manager.
    # [START index_manager]
    manager = pywrapcp.RoutingIndexManager(len(data['distance_matrix']),
                                           data['num_vehicles'], data['depot'])
    # [END index_manager]
    # Create Routing Model.
    # [START routing_model]
    routing = pywrapcp.RoutingModel(manager)
    # [END routing_model]

    # Define cost of each arc.
    # [START arc_cost]
    # [END arc_cost]
    # Register a time callback and add time windows constraint.
    # [START time_callback]
    time_callback_index = routing.RegisterTransitCallback(
        functools.partial(time_callback, manager, data))
    add_time_window_constraints(routing, manager, data, time_callback_index)

    
    
    # travel_callback_index = routing.RegisterTransitCallback(
    #     functools.partial(travel_callback, manager, data))
    # add_travel_constraints(routing, manager, data, travel_callback_index)
    # [END time_callback]
    # Register a distance callback and add autonomy constraint.
    # [START distance_callback]
    distance_callback_index = routing.RegisterTransitCallback(
        functools.partial(distance_callback, manager, data))
    add_autonomy_constraint(routing, distance_callback_index)
    routing.SetArcCostEvaluatorOfAllVehicles(distance_callback_index)
    # [END distance_callback]
    # Setting first solution heuristic (cheapest addition).
    # [START parameters]
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)  # pylint: disable=no-member
    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH)
    search_parameters.time_limit.FromSeconds(3)
    # [END parameters]

    # Solve the problem.
    # [START solve]
    assignment = routing.SolveWithParameters(search_parameters)
    # [END solve]

    # Print solution on console.
    # [START print_solution]
    if assignment:
        print_solution(data, manager, routing, assignment)
    else:
        print('No solution found!')
    # [END print_solution]
if __name__ == '__main__':
    solve()