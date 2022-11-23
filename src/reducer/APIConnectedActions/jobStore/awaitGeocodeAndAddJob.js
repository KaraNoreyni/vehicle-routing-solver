import { geocode } from "../../../actions/getGeocode";
import { addJob } from "../../../reducer/jobsReducer";
import { Store } from "../../../reducer";

export const awaitGeocodeAndAddJob = async function (text, date, index) {
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
    return Store.dispatch(addJob(job));
  }