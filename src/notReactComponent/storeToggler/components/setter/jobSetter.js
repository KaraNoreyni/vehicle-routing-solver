import { Store } from "../../../../reducer";
import { awaitGeocodeAndAddJob } from "../../../../components/fleetComponents/actions/awaitGeocodeAndAddJob";

export class jobSetter  extends HTMLFormElement{
    constructor () {
        super()
        this.onsubmit = function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            const index = Store.getState().jobs.length
            const address = this.addressInput.value
            const dates = this.dates.map(d => d.toLocalString());

            awaitGeocodeAndAddJob(address, dates, index)
        }
    }
    get dates() {
        return [
            new Date(this.startDateInput.value),
            new Date(this.endDateInput.value)
        ]
    }
    get address() {
        return this.addressInput.value
    }

    connectedCallback() {
    }
}


