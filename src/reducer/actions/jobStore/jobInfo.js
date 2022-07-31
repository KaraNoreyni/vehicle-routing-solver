export function getJobInfo(job) {
    return {
            'address': job.id,
            'startDate': job.deliveries[0].places[0].times[0][0],
            'endDate': job.deliveries[0].places[0].times[0][1]
        }
        
}

export function jobHasChanged(oldJob, newJob) {
    return (JSON.stringify(getJobInfo(oldJob)) != 
        JSON.stringify(getJobInfo(newJob)))
}

export function storeAttributeHasChanged(oldValue, newValue) {
    return (oldValue != newValue)
}