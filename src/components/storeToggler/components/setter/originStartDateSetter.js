import { Store } from "../../../../reducer"
import { setShiftStartDate } from "../../../../reducer/fleetReducer"
import { setRouteOriginstartDates } from "../../../../reducer/jobsReducer"

export class originStartDateSetter extends HTMLFormElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.onsubmit = e => {
            e.preventDefault()
            const date = new Date(this['startDate'].value)
            Store.dispatch(setShiftStartDate(date.toISOString()))
            Store.dispatch(setRouteOriginstartDates(date.toISOString()))
        }
    }
}