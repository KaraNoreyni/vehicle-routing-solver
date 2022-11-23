import { Store } from "../../reducer"
import { formatDate } from "../../actions/formatDate"
export class startDateComponent extends HTMLElement {
    constructor() {
        super()
        this._time = Store.getState().jobs[0].deliveries[0].places[0].times[0][0]

        this.unsubscribe = Store.subscribe(() => {
            console.log(Store.getState().jobs[0].deliveries[0].places[0].times[0][0])

            if (Store.getState().jobs[0].deliveries[0].places[0].times[0][0] != this._time) {
                this.time = Store.getState().jobs[0].deliveries[0].places[0].times[0][0]
            }
        })
    }
    get time() {
        return this._time
    }
    set time(newValue) {
        this._time = new Date(newValue).toISOString()
        const date = new Date(this.time)
        const dateOptions = {weekday:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'numeric'}
        const datesString = new Intl.DateTimeFormat(
                "fr-FR", dateOptions).format(
                    date)
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