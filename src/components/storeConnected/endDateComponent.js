import { Store } from "../../reducer"
import { formatDate } from "../../actions/formatDate"
export class endDateComponent extends HTMLElement {
    constructor() {
        super()
        this._time = Store.getState().jobs[0].deliveries[0].places[0].times[0][1]

        const dateOptions = {weekday:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'numeric'}
        const datesString = new Intl.DateTimeFormat(
                "fr-FR", dateOptions).format(
                    new Date(this.time))

        this.unsubscribe = Store.subscribe(() => {
            if (Store.getState().jobs[0].deliveries[0].places[0].times[0][1] != this._time) {
                this.time = Store.getState().jobs[0].deliveries[0].places[0].times[0][1]
            }
        })
    }
    get time() {
        return this._time
    }
    set time(newValue) {
        this._time = new Date(newValue).toISOString()
        
        const dateOptions = {weekday:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'numeric'}
        const datesString = new Intl.DateTimeFormat(
                "fr-FR", dateOptions).format(
                    new Date(this.time))
        this.innerHTML = `${datesString}`
    }
    connectedCallback() {
        const dateOptions = {weekday:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'numeric'}
        const datesString = new Intl.DateTimeFormat(
                "fr-FR", dateOptions).format(
                    new Date(this.time))

        this.innerHTML = `${datesString}`
    }
}