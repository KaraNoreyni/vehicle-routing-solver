import { Store } from "../../../../reducer"
import { deleteJobber } from "../../../../reducer/fleetReducer"

export class deleteJobberButton extends HTMLButtonElement {
    constructor() {
        super()
        this._jobber = ''
    }
    get jobber() {
        return this._jobber
    }
    set jobber(newValue) {
        this._jobber = newValue
    }
    connectedCallback() {
        this.jobber = this.getAttribute('jobber')
        this.onclick = (e) => {
            console.log(this.jobber)
            Store.dispatch(deleteJobber(this.jobber))
        }
    }
}

