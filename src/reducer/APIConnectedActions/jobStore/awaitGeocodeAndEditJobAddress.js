import { geocode } from "../../../actions/getGeocode";
import { editJobAddress } from "../../../reducer/jobsReducer";
import { Store } from "../../../reducer";

export const awaitGeocodeAndEditJobAddress = async function (text, jobIndex) {
    console.log('waiting for geocode');

    const location = await geocode(text);
    const payload = {
      jobIndex: jobIndex,
      location: {
          lat: location.lat(),
          lng: location.lng()
      },
      address: text
    }
    return Store.dispatch(editJobAddress(payload));

}