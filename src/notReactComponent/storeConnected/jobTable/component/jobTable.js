import { Store } from "../../../../reducer";
import { makeJobRows } from "../actions/makeJobRows";

export default class jobTable extends HTMLElement {
    constructor() {
        super()
        this._jobs = Store.getState().jobs.slice(1)
        Store.subscribe(() => {
            if (Store.getState().jobs.slice(1).length !== this.jobs.length){
                console.log('jobs update')
                this.jobs = Store.getState().jobs.slice(1)
            }
        })

        this.table = document.createElement('table');
        this.table.classList.add('fill')
        this.table.tHead = document.createElement('thead')
        this.table.tHead.innerHTML = `
        <tr>
            <th>adresse</th>
            <th>debut</th>
            <th>fin</th>
            <th></th>
        </tr>
        `
        this.table.appendChild(this.table.tHead)

        this.table.tBody = document.createElement('tbody')
        this.table.appendChild(this.table.tBody)

    }

    get jobs() {
        return this._jobs
    }
    set jobs(newJobs) {
        this._jobs = newJobs
        makeJobRows(this.jobs, this.table.querySelector('tbody'))
    }

    connectedCallback() {
        makeJobRows(this.jobs, this.table.tBody)
        this.appendChild(this.table)
    }
}
