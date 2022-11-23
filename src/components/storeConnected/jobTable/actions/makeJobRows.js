
export function makeJobRows(jobs, tBody) {
    tBody.innerHTML = ''
    if (jobs.length > 0) {
        jobs.forEach(job => {
            const jobIndex = job.deliveries[0].places[0].location.index
            const jobRow = document.createElement('tr', {
                is: 'job-row'
            })
            jobRow.setAttribute('jobIndex', jobIndex)
            tBody.appendChild(jobRow)
        })
        const tD = document.createElement('td')
        tD.style.padding = '.325em .5em'
        tD.colSpan = 4
        tD.style.borderBottomLeftRadius = '8px'
        tD.style.borderBottomRightRadius = '8px'
        tD.style.border = '1px solid var(--gray-400)'
        tD.style.borderTop = ''
        tBody.appendChild(tD)

        const resolveButton = document.createElement('resolve-button')
        resolveButton.style.display = 'block'
        resolveButton.style.width = 'fit-content'
        resolveButton.style.margin = 'auto'

        tD.appendChild(resolveButton)
    } else {
        tBody.innerHTML = `
        <tr>
            <td colspan='4'>
                Ajoutez au moins une livraison 
                <br>
                pour pouvoir optimiser vos trajet.
            </td>
        </tr>`
        tBody.style.textAlign = 'center'
    }
}