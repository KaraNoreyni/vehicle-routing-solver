import { matrix } from "./getMatrix";
import { solve_route } from "./resolveRoutingProblem";

export const  awaitMatrixAndResolveProblem = async (jobs, fleet) => {
    const waypoints = jobs.map((job) => {
        return{
            coordinates: [
                job.deliveries[0].places[0].location.lng, 
                job.deliveries[0].places[0].location.lat
            ]
        }
    });
    console.log(waypoints)
    const Matrix = await matrix(waypoints)

    const jobsPlan = jobs.map((job) => {
        let newJob = Object.assign({}, job);
        newJob = JSON.parse(JSON.stringify(newJob));
        newJob.deliveries[0].places[0].location = {
            index: job.deliveries[0].places[0].location.index
        }; 
        return newJob
    });

    const Problem = {
        plan: {
            jobs: jobsPlan.slice(1),
        },
        fleet: fleet,
    };
    console.log(Problem)
    return new Promise ((resolve, reject) => {
        try {
            resolve(solve_route(Problem, Matrix))
        } catch (error) {
            reject(error)
        }
    })
}   