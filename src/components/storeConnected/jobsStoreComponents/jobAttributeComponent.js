import { formatDate } from "../../../actions/formatDate"

export class jobAttributeComponent extends HTMLElement {
    constructor() {
        super()
    }
    static get observedAttributes() {return ['value'] }

    connectedCallback() {
        const value = this.getAttribute('value')
        if (this.hasAttribute('address')) {
            this.textContent = value
        } else if (this.hasAttribute('startDate') || this.hasAttribute('endDate')) {
            this.textContent = formatDate(value, {
                hour: 'numeric', 
                minute: 'numeric',
                hour12: true })
        }
        
    }
    attributesChangedCallback(name, oldValue, newValue) {
        if(name == 'value' && oldValue!=newValue) {
            this.textContent = this.getAttribute('value')
        }
    }
}
