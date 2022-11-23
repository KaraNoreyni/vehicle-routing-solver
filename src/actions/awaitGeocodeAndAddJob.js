import { geocode } from "./getGeocode";
import { addJob } from "../reducer/jobsReducer";
import { Store } from "../reducer";

export const awaitGeocodeAndAddJob = async function (text, date, index) {
    console.log(text)
    const dispatch = Store.dispatch
    console.log('waiting for geocode');

    try {
      const location = await geocode(text);
      const job = {
          id: text,
          deliveries: [{
            places: [{
                location: {
                    index: index,
                    lat: location.lat(),
                    lng: location.lng(),
                },
                duration: 300,
                times: [date]
              }],
            demand: [
                1
            ],
            }]
      };
      dispatch(addJob(job));
    } catch (error) {
        console.log(error)
        // setState(error)
    }

  }