import { awaitGeocodeAndSetRouteOrigin } from "../../../../actions/awaitGeocodeAndSetRouteOrigin";
import { Store } from "../../../../reducer";

export class originSetter extends HTMLFormElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.onsubmit = (e) => {
            e.preventDefault()
            const dates = Store.getState().jobs[0].deliveries[0].places[0].times[0];
            const text = this['address'].value;
    
            awaitGeocodeAndSetRouteOrigin(text, dates, Store.dispatch)
        }
    }
}