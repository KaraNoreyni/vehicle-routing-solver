
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
            console.log(response)
            const travelTimesFloat = data.durations.flat()
            const distancesFloat = data.distances.flat()
            const travelTimesFloor = travelTimesFloat.map((x) => Math.floor(x))
            const distancesFloor = distancesFloat.map((x) => Math.floor(x))
            console.log(distancesFloor)
            resolve([{
                "matrix": "normal_car",
                "travelTimes": travelTimesFloor,
                "distances": distancesFloor,
            }])
        }).catch(e => reject(e))
    
    })


    
}