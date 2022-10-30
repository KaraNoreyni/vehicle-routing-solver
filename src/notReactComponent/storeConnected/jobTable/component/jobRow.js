import { awaitGeocodeAndEditJob } from "../../../../components/fleetComponents/actions/awaitGeocodeAndEditJob";
import { Store } from "../../../../reducer";
import { deleteJob, editAddress } from "../../../../reducer/jobsReducer";
import { dateToLocalDateTimeFormat } from "../../../../actions/dateToLocalDateTimeFormat";
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
function makeJobRow(row){
    row.innerHTML = ''
    Object.entries(row.jobInfo).forEach((entrie, idx) => {
        const key = entrie[0]
        const value = entrie[1]
        row.setAttribute(key, value)
        row[`${key}Input`] = document.createElement('input')
        if (key != 'address') {
            row[`${key}Input`].setAttribute('type', 'datetime-local')
            console.log(new Date(value))
            
            row[`${key}Input`].value = value.slice(0, 16)
        } else {
            row[`${key}Input`].setAttribute('type', 'text')
            row[`${key}Input`].value = value
        }
        row[`${key}Input`].setAttribute(key, value)
        
        row[`${key}Input`].setAttribute('disabled', '')
        row[`${key}Input`].parentDiv = document.createElement('div')
        row[`${key}Input`].parentDiv.appendChild(row[`${key}Input`])
        row[`${key}Input`].td = document.createElement('td')
        row[`${key}Input`].td.classList.add('td-input')
        row[`${key}Input`].td.appendChild(row[`${key}Input`].parentDiv)
        row.appendChild(row[`${key}Input`].td)
    })

    row.buttonTd = document.createElement('td')
    row.buttonDiv = document.createElement('div')
    row.buttonDiv.classList.add('flex')
    row.buttonTd.appendChild(row.buttonDiv)

    row.editButton = document.createElement('button')
    row.editButton.classList.add('action-button', 'edit', 'component')
    row.editButton.textContent = "Edit"

    row.editButton.onclick = function () {
        row.setAttribute('edit', '')
    }
    row.buttonDiv.appendChild(row.editButton)

    row.deleteButton = document.createElement('button')
    row.deleteButton.classList.add('action-button', 'delete', 'component')
    row.deleteButton.textContent = "delete"
    row.deleteButton.onclick = function () {
        Store.dispatch(deleteJob(row.job))
    }
    row.buttonDiv.appendChild(row.deleteButton)

    row.appendChild(row.buttonTd)
}
