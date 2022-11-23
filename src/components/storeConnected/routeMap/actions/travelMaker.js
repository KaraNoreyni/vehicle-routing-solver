import { Store } from "../../../../reducer";

export function travelMaker(googleMap, mapRoute) {
  console.log(mapRoute)
    const jobs = Store.getState().jobs
    const route = mapRoute.route

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(googleMap);

    const waypoints = route.stops.slice(1).map((step) => {
      const indexLocation = jobs.filter(job => job.deliveries[0].places[0].location.index === step.location.index)[0].deliveries[0].places[0].location
      return {
        location: {
          lat: indexLocation.lat,
          lng: indexLocation.lng
        },
        stopover: false,
      }
    });
    
    directionsService.route({
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
    }).then((response) => {
      console.log(response)
      console.log(directionsRenderer)
      directionsRenderer.setDirections(response);
    }).catch(e => {
      // do something
      console.log(e)
    });
    const markers = route.stops.map((step, idx, stops) => {
      const type = step.activities[0].type
      const job = jobs.filter(job => job.deliveries[0].places[0].location.index === step.location.index)[0]
      const location = job.deliveries[0].places[0].location
      
      if (type === "delivery") {
        const arrival = step.time.arrival;
        const departure = step.time.departure;
        const waiting = (new Date(departure) - new Date(arrival)) / 1000;
        const nextStep = stops[idx+1];
        const nextStepDistance = nextStep.distance - step.distance ;
        const nextStepDuration = nextStep.time.arrival - step.time.departure;
        
          const addresse = step.activities[0].jobId
          const prevStep = stops[idx-1];
          const prevStepDistance = step.distance - prevStep.distance ;
          const prevStepDuration = step.time.departure - prevStep.time.arrival ;
          const contentString = 
          '<div>' +
          '<p>' + addresse + '</p>' +
          '<p>arrivée : '  + arrival + '</p>' +
          '<p>départ : ' + departure + '</p>' +
          '<p>attente : ' + waiting + 'sec</p>' +
          '<p>distance effectué' + prevStepDistance + 'm' + '</p>' +
          '<p>durée du trajet' + prevStepDuration + 'sec' + '</p>' +
          '<p>prochaine destination : ' + nextStep.activities[0].jobId + '</p>' +
          '</div>';
          
          const infowindow = new window.google.maps.InfoWindow({
            content: contentString,
          });
  
          const marker = new window.google.maps.Marker({
            position: {
              lat: location.lat,
              lng: location.lng
            },
            label: idx.toString(),
            map: googleMap,
          })
          marker.addListener("click", () => {
            infowindow.open({
              anchor: marker,
              googleMap,
              shouldFocus: false,
            });
          });
      }

    })
}