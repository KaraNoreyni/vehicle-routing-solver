import { getJobInfo, jobHasChanged } from "../../../../reducer/actions/jobStore/jobInfo"
import { pointedStoreComponent } from "../../pointed/pointedStoreComponent"

const jobAttributes = [
    'address',
    'endDate',
    'startDate'
]

export class pointedJobComponent extends pointedStoreComponent {
    constructor() {
        super()
        this._storeChangedCallback = (oldJob, newJob, 
            oldDependencyJob, newDependencyJob) => {
                this.job = newJob
                return this.job
        }
        this._condition = (oldJob, newJob, 
            oldDependencyValue, newDependencyValue) => {
                return (oldDependencyValue === newDependencyValue &&
                    jobHasChanged(oldJob, newJob))
            }
    }
    getJobAttributesElements() {
        const obj = {}
        jobAttributes.forEach(attribute => {
            const target = this.querySelector(`[${attribute}]`)
            obj[`${attribute}`] = target})
        return obj
    }
    jobChangedCallback(changedJob, attributesElements) {
        const changedJobInfo = getJobInfo(changedJob)
        jobAttributes.forEach(attribute => {
            if(attributesElements[`${attribute}`].getAttribute(
                'value') != changedJobInfo[`${attribute}`]) {
                    attributesElements[attribute].setAttribute(
                        'value', changedJobInfo[attribute])
            }
        });
    }
    connectedCallback() {
        this.connectStore()
        this._job = this.storePointer.storeAttributeValue
        const jobInfo = getJobInfo(this.job)
        this.innerHTML = `
        <job-attribute-component address value="${jobInfo.address}"></job-attribute-component>
        <br/>
        <job-attribute-component startDate value="${jobInfo.startDate}"></job-attribute-component>
        >
        <job-attribute-component endDate value="${jobInfo.endDate}"></job-attribute-component>

        `
    }
    get job() {
        return this._job
    }
    set job(newJob) {
        this._job = newJob
        const attributesElements = this.getJobAttributesElements()
        this.jobChangedCallback(newJob, attributesElements)
    }
}
