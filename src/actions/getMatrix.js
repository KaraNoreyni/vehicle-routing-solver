
export const matrix = function (waypoints) {
    // Get matrix coord with mapbox sdk
    // waypoints should be dfined as [[lng,lat],[lng,lat]...]
    const mbxClient = require('@mapbox/mapbox-sdk/services/matrix');
    const baseClient = mbxClient({ 
        accessToken: "pk.eyJ1Ijoibm9ub3hyIiwiYSI6ImNsMWVzYjltZTBlOGYzbHJ0aDR0dWF1YnIifQ.D5aikefubzaFf4QbKfNfWg" 
    });
    return new Promise((resolve, reject) => {
        baseClient.getMatrix({
            points: waypoints,
            profile: 'driving',
            annotations: ["duration", "distance"]
        }).send(
        ).then(response => {
            const data = response.body;

            const travelTimes = data.distances.flat()
            const distances = data.durations.flat()

            resolve([{
                "matrix": "normal_car",
                "travelTimes": travelTimes,
                "distances": distances,
            }])
        }).catch(e => reject(e))
    
    })


    
}