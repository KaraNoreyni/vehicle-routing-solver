import init, { get_routing_locations, solve_pragmatic } from 'vrp-cli';

export const solve_route = async function (problem, matrix) {
    await init();
    const config = {
        "termination": {
             "maxTime": 10,
             "maxGenerations": 1000
        }
    };
    return new Promise((resolve) => {
        resolve(solve_pragmatic(problem, matrix, config))
    })
}

