import { Store } from "../../../../reducer"
import { deleteJob } from "../../../../reducer/jobsReducer"
export function makeJobRow(row){
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