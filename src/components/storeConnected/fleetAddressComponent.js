import { Store } from "../../reducer"

export class fleetAddressComponent extends HTMLElement {
    constructor() {
        super()
        this._address = Store.getState().jobs[0].id
        this.unsubscribe = Store.subscribe(() => {
            if (Store.getState().jobs[0].id != this._address) {
                this.address = Store.getState().jobs[0].id 
            }
        })
    }
    get address() {
        return this._address
    }
    set address(newValue) {
        this._address = newValue
        this.innerHTML = `${this._address}`
    }
    connectedCallback() {
        this.innerHTML = `
        ${this.address}
        `
    }
}