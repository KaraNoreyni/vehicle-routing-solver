

import { createRef, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { awaitMatrixAndResolveProblem } from '../../actions';
import { geocode } from '../../actions/getGeocode';
import { addJob } from '../../reducer/jobsReducer';
import {  setMapRoute } from '../../reducer/mapRouteReducer';
import { setRoutes } from '../../reducer/routeReducer';
 
Date.prototype.addMinutes = function(minutes) {
  var copiedDate = new Date(this.getTime());
  return new Date(copiedDate.getTime() + minutes * 60000);
}

export const AutocompleteWidget = (props) => {
    // Autocomplete initialisation 
    // TODO: ENABLE API IN GOOGLE CONSOLE 

    /**
    const options = {
      center: {
        lat: 45.7756392,
        lng: 4.8037335,
      },
      componentRestriction : { country: "fr" },
      field: ["address_components", "geometry"],
      types: ["address"]
    };
    useEffect(() => {
         new window.google.maps.places.Autocomplete(ref.current, options)
    })

    **/

    const dispatch = useDispatch()
    const ref = useRef(null);
    const jobs =  useSelector((state) => state.jobs)
    const fleet = useSelector((state) => state.fleet)
    const [text, setText] = useState("");
    const [date, setDate] = useState([new Date(null),new Date(null)]);
    const [state, setState] = useState("");

    const awaitGeocodeAndAddJob = async function () {
      console.log('waiting for geocode');
      setState("Chargement...");

      try {
        const location = await geocode(text);
        console.log(location)
        setState("succesful geocode for " + text + " (lat: " + location.lat() + ", lng: " + location.lng() + " )")
        const job = {
            id: text,
            deliveries: [
              {
                places: [
                  {
                    location: {
                      index: jobs[jobs.length - 1].deliveries[0].places[0].location.index + 1,
                      lat: location.lat(),
                      lng: location.lng(),
                    },
                      duration: 300,
                      times: [date]
                  },
                ],
                demand: [
                    1
                ],
              },
            ]
        };
        dispatch(addJob(job));
      } catch (error) {
          console.log(error)
          setState(error)
      }
    };
    
    useEffect(() => {
      async function resolver() {
        const solution = await awaitMatrixAndResolveProblem(jobs, fleet)
        dispatch(setRoutes(JSON.parse(solution)));
        const routeMaps = JSON.parse(solution).tours.map((route) => {
          return {
            id: 1, 
            center: {
                lat: 45.7756392,
                lng: 4.8037335,
            },
            zoom: 12,
            style: {
                width: 350 + 'px', 
                height: 350 + 'px'
            },
            route: route,
            ref: createRef(),
          }
        })
        dispatch(setMapRoute(routeMaps))
        return JSON.parse(solution) 
      };
      if (jobs.length > 1) { 
        try {
          resolver()
        } catch (error) {
          console.log(error)
        }
      }
    },[jobs, fleet])


    return (<form action="" onSubmit={ (e) =>{ e.preventDefault();  awaitGeocodeAndAddJob()}}>
      <ul>
      {jobs.map((job) => {
       return <li key={job.id}>
            {job.id}
            <ul>
                <li>{"latitude : "} {job.deliveries[0].places[0].location.lat}</li>
                <li>{"longitude : "} {job.deliveries[0].places[0].location.lng}</li>
                <li>{"schedule : "} {job.deliveries[0].places[0].times[0]}</li>
            </ul></li> 
          })}
      </ul>
      ;
      <input required={true} ref={ref} onChange={(e) => setText(e.target.value)} className="AutocompleteWidget" placeholder='40 Rue Marietton, 69009 Lyon'/>
      <input required={true} type="datetime-local" onChange={(e) => {
        const start = new Date(e.target.value)
        const end = new Date(start.getTime() + 30 * 60000) // +30min
        setDate([start.toISOString(), end.toISOString()])
        }}/>
      <button>x</button>
      <button onClick={()=>{}}>Calculer les itiniraire</button>
      <p>{ state }</p>
    </form>)
  }