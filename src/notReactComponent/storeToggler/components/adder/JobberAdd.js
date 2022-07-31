import { Store } from "../../../../reducer"
import { addJobber } from "../../../../reducer/fleetReducer"

export class jobberAdd extends HTMLFormElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.onsubmit = (e) => {
            e.preventDefault()
            Store.dispatch(addJobber(this['jobberName'].value))
        }
    }
}