import { geocode } from "./getGeocode";
import { editJob } from "../reducer/jobsReducer";
import { Store } from "../reducer";

export const awaitGeocodeAndEditJob = async function (payload) {
    const dispatch = Store.dispatch
    console.log('waiting for geocode');
    try {
        const location = await geocode(payload.address);
        payload.location = {
            index: payload.jobIndex,
            lat: location.lat(),
            lng: location.lng()
        }
      dispatch(editJob(payload));
    } catch (error) {
        console.log(error)
        // setState(error)
    }

}