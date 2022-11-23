import { Store } from "../../reducer"

export class jobbersList extends HTMLUListElement {
    constructor() {
        super()
        this._jobbers = Store.getState().fleet.vehicles[0].vehicleIds
        this.state = Store.getState()
        this.unsubscribe = Store.subscribe(() => {
            if (Store.getState().fleet.vehicles[0].vehicleIds.length != this.jobbers.length) {
                this.jobbers = Store.getState().fleet.vehicles[0].vehicleIds
            }
        })

    }
    connectedCallback() {
        this.innerHTML = `
        ${this._jobbers.map(jobber => {
            return `
            <li class='list-item'>
                <div class='flex space-b'>
                    <span 
                    class='component'>${jobber}</span>
                    <button 
                    is='jobber-delete'
                    class='component end deleteButton'
                    jobber=${jobber}>supprimer</button>
                </div>
            </li>`
        }).join('')}
        `
    }
    get jobbers() {
        return this._jobbers
    }
    set jobbers(newValue) {
        this._jobbers = newValue
        console.log(newValue)
        this.innerHTML = `
        ${this._jobbers.map(jobber => {
            return `
            <li class='list-item'>
                <div class='flex space-b'>
                    <span 
                    class='component'>${jobber}</span>
                    <button 
                    is='jobber-delete'
                    class='component end deleteButton'
                    jobber=${jobber}>supprimer</button>
                </div>
            </li>`
        }).join('')}
        `
    }
}