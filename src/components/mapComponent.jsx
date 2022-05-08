
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMap } from '../reducer/mapReducer';

Date.prototype.addMinutes = function(minutes) {
  var copiedDate = new Date(this.getTime());
  return new Date(copiedDate.getTime() + minutes * 60000);
}

export const Map = (props) => {
  const map = props.map
  const style = map.style
  const center = map.center
  const zoom = map.zoom
    
  const ref = useRef(map.ref)
  useEffect(() => {
    new window.google.maps.Map(ref.current, {
      center,
      zoom
    })
  })
  return (<li><div ref={ref} className="map" style={style} /></li>)
}




export const MapListWithStore = () => {
  const dispatch = useDispatch();
  const maps =  useSelector((state) => state.map);
  const style = {
    display: "flex",
    flexWrap: "wrap"
  }
  return (<div>
    <ul style={style}> 
      {maps.map((map => {
          return <Map map={map} key={map.id}></Map>
      }))}
    </ul>
    <button onClick={() => {dispatch(addMap())}}>+</button>
    
  </div>
  )
}



export const MapRoute = (props) => {
  const map = props.map
  const route = map.route
  const jobs =  useSelector((state) => state.jobs)
  const style = map.style
  const center = map.centers
  const zoom = map.zoom
  const ref = useRef(map.ref)

  useEffect(() => {
    
    const googleMap = new window.google.maps.Map(ref.current, {
      center,
      zoom
    })
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
        "lat": 45.7756392,
        "lng": 4.8037335
      },
      destination: {
        "lat": 45.7756392,
        "lng": 4.8037335
      },
      waypoints: waypoints,
      optimizeWaypoints: false,
      travelMode: window.google.maps.TravelMode.DRIVING,
    }).then((response) => {
      directionsRenderer.setDirections(response);
    }).catch(e => {
      // do something
      console.log(e)
    });
  })
  return (<li><div ref={ref} className="map" style={style} /></li>)
}




export const MapRouteListWithStore = () => {
  const map =  useSelector((state) => state.map[0]);
  const style = {
    display: "flex",
    flexWrap: "wrap"    
  }
  const mapRoutes = useSelector((state) => state.mapRoute)
  if (mapRoutes != undefined) {
    return (<div>
        <ul style={style}> 
          {mapRoutes.map((mapRoute => {
              return <MapRoute map={mapRoute} key={mapRoute.route.vehicleId}></MapRoute>
          }))}
        </ul>
        
      </div>
    )
  }
}
  



