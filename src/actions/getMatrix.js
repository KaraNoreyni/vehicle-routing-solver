import  mapBoxClient  from '@mapbox/mapbox-sdk/services/matrix'

export const matrix = function (waypoints) {
    // Get matrix coord with mapbox sdk
    // waypoints should be dfined as [[lng,lat],[lng,lat]...]
    const baseClient = mapBoxClient({ 
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
            console.log(data)
            const travelTimesFlat = data.durations.flat()
            const distancesFlat = data.distances.flat()
            const travelTimesFloor = travelTimesFlat.map((x) => Math.floor(x))
            const distancesFloor = distancesFlat.map((x) => Math.floor(x))
            console.log(distancesFloor)
            resolve([{
                "matrix": "normal_car",
                "travelTimes": travelTimesFloor,
                "distances": distancesFloor,
            }])
        }).catch(e => reject(e))
    
    })  
}
export const getMatrix = function (waypoints) {
    // Get matrix coord with mapbox sdk
    // waypoints should be dfined as [[lng,lat],[lng,lat]...]
    const baseClient = mapBoxClient({ 
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
            resolve([{
                "duration": data.durations,
                "distances": data.distances,
            }])
        }).catch(e => reject(e))
    })  
}

