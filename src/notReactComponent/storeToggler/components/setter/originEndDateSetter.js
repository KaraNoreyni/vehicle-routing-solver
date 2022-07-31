
import { Store } from "../../../../reducer"
import { setShiftEndDate } from "../../../../reducer/fleetReducer"
import { setRouteOriginendDates } from "../../../../reducer/jobsReducer"

export class originEndDateSetter extends HTMLFormElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.onsubmit = e => {
            e.preventDefault()
            const date = new Date(this['endDate'].value)
            Store.dispatch(setShiftEndDate(date.toISOString()))
            Store.dispatch(setRouteOriginendDates(date.toISOString()))
        }
    }
}