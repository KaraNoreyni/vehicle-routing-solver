import { geocode } from "../actions/getGeocode";
import { setRouteOrigin } from "../reducer/jobsReducer";
import { setShift } from "../reducer/fleetReducer";

export const awaitGeocodeAndSetRouteOrigin = async function (text, date, dispatch) {
  console.log(text);
    console.log('waiting for geocode');
    // setState("Chargement...");

    try {
      const location = await geocode(text);
      console.log(location)
      // setState("succesful geocode for " + text + " (lat: " + location.lat() + ", lng: " + location.lng() + " )")
      const job = {
          id: text,
          deliveries: [
            {
              places: [
                {
                  location: {
                    index: 0,
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
      const shift = {
        "start": {
          "earliest": date[0],
          "location": {
            "index": 0
          }
        },
        "end": {
          "latest": date[1],
          "location": {
            "index": 0
          }
        }
      }
      dispatch(setRouteOrigin(job));
      dispatch(setShift(shift));
    } catch (error) {
        console.log(error)
        // setState(error)
    }

  }