import { Store } from "../../../../reducer";

export function setRoutes(routes, googleMap) {
    const jobs = Store.getState().jobs
    const directionsService = new window.google.maps.DirectionsService();
    let requestArray = []; let renderArray = []
    routes.forEach(obj => {
      const route = obj.route
      const waypoints = route.stops.slice(1).map((step) => {
        const indexLocation = jobs.filter(job => job.deliveries[0].places[0].location.index === step.location.index)[0].deliveries[0].places[0].location
        return {
          location: {
            lat: indexLocation.lat,
            lng: indexLocation.lng
          },
          stopover: false,
        }
      })
      const request = {
        origin: {
          "lat": jobs[0].deliveries[0].places[0].location.lat,
          "lng": jobs[0].deliveries[0].places[0].location.lng
        },
        destination: {
          "lat": jobs[0].deliveries[0].places[0].location.lat,
          "lng": jobs[0].deliveries[0].places[0].location.lng
        },
        waypoints: waypoints,
        optimizeWaypoints: false,
        travelMode: window.google.maps.TravelMode.DRIVING,
      }
      requestArray.push(request)
    })
    requestArray.forEach((request, idx) => {
      renderArray[idx] =  new window.google.maps.DirectionsRenderer()
      renderArray[idx].setMap(googleMap)
      directionsService.route(requestArray[idx]).then(response => {
        renderArray[idx].setDirections(response)
      }).catch(e => {
        // do something
        console.log(e)
      });
    })
  }
  