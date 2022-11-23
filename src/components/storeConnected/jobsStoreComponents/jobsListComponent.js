import { getJobInfo } from "../../../reducer/actions/jobStore/jobInfo"
import { pointedStoreComponent } from "../pointed/pointedStoreComponent"

export class pointedjobsListComponent extends pointedStoreComponent {
    constructor() {
        super()
        this._storeChangedCallback = (oldJobsList, newJobsList,
            oldDependencyValue, newDependencyValue) => {
            this.jobsList = newJobsList
            return this.jobsList}
        this._condition =  (oldJobsList, newJobsList, 
            oldDependencyValue, newDependencyValue) => {
                console.log(oldJobsList,newJobsList)
                return (oldJobsList.length != newJobsList.length)
            }
    }
    render() {
        this.innerHTML = `
            ${this.jobsList.map(job => {
                const jobIndex = job.deliveries[0].places[0].location.index
                const jobInfo = getJobInfo(job)
                return `
                    <job-component 
                        storeAttributeKeys='jobs,at ${jobIndex}'
                        dependencyKeysArray='jobs,length'>
                    </job-component>
                `
            }).join('')}
        `
    }
    connectedCallback() {
        this.connectStore()
        this._jobsList = this.storePointer.storeAttributeValue
        this.render()
    }
    get jobsList() {
        return this._jobsList
    }
    set jobsList(newJobsList) {
        if (this.jobsList.length != newJobsList.length) {
            this._jobsList = newJobsList
            this.render()
        }
    }
}