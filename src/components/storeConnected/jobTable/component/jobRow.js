import { awaitGeocodeAndEditJob } from "../../../../actions/awaitGeocodeAndEditJob";
import { Store } from "../../../../reducer";
import { makeJobRow } from "../actions/makeJobRow";

export class jobRow extends HTMLTableRowElement {
    constructor() {
        super()
        this.unsubscribe = Store.subscribe(() => {
            console.log('a')
            if (Store.getState().jobs[this.jobIndex] != this.job) {
                console.log('aa')
                this.job = Store.getState().jobs[this.jobIndex]
            }
        })
    }

    get job() {
        return this._job
    }
    set job(newJob) {
        this._job = newJob
        console.log(this._job)
        const schedule = this._job.deliveries[0].places[0].times[0]
        this.jobInfo = {
            'address': this.job.id,
            'startDate': schedule[0],
            'endDate': schedule[1]
        }
        console.log(this.jobInfo)
        makeJobRow(this)
    }
    static get observedAttributes () {
        return ['edit']
    }
    connectedCallback() {
        this.jobIndex = parseInt(this.getAttribute('jobIndex'))
        this._job = Store.getState().jobs[this.jobIndex]
        const schedule = this.job.deliveries[0].places[0].times[0]
        this.jobInfo = {
            'address': this.job.id,
            'startDate': schedule[0],
            'endDate': schedule[1]
        }
        makeJobRow(this)
    }
    disconnectedCallback() {
        this._job = Store.getState().jobs[this.jobIndex]
        this.unsubscribe()
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === 'edit') {
            const inputs = Array.from(this.querySelectorAll('input'))
            if (name) {
                inputs.forEach(input => {
                    input.removeAttribute('disabled')
                })
                this.confirmButton = document.createElement('button')
                this.confirmButton.classList.add(
                    'action-button', 'confirm', 'component'
                )
                this.confirmButton.textContent = 'V'
                this.confirmButton.onclick = e => {
                    const newAddress = this.addressInput.value != 
                        this.jobInfo.address ?
                            this.addressInput.value : 
                            this.jobInfo.address

                    const newStartDate = this.startDateInput.value !=
                        this.jobInfo.startDate ?
                            this.startDateInput.value : 
                            this.jobInfo.startDate

                    const newEndDate = this.endDateInput.value != 
                        this.jobInfo.endDate ?
                            this.endDateInput.value : 
                            this.jobInfo.endDate

                    const payload = {
                        jobIndex: this.jobIndex,
                        address: newAddress,
                        schedule: [
                            newStartDate,
                            newEndDate,
                        ]
                    }
                    awaitGeocodeAndEditJob(payload)
                }

                this.undoButton = document.createElement('button')
                this.undoButton.classList.add(
                    'action-button', 'undo', 'component'
                )
                this.undoButton.textContent = 'X'
                this.undoButton.onclick = e => {
                    makeJobRow(this)
                }

                this.editButton.parentElement.removeChild(this.editButton)
                this.deleteButton.parentElement.removeChild(this.deleteButton)

                this.buttonDiv.appendChild(this.confirmButton)
                this.buttonDiv.appendChild(this.undoButton)
            } else {
                inputs.forEach(input => {
                    input.setAttribute('disabled', '')
                })
            }
        }
    }
}

