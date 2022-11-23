export class contentTogglerButton extends HTMLButtonElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.siblingElement = document.querySelector(
            `#${this.getAttribute('for')}`)
        this.siblingElement.width = this.siblingElement.getBoundingClientRect().width
        this.siblingElement.class = this.siblingElement.className
        this.siblingElement.removeAttribute('class')
        this.siblingElement.style.width = '0px'
        this.siblingElement.style.visibility = 'hidden'
        
        this.onclick = function() {
            if (this.siblingElement.getBoundingClientRect().width !=
            this.siblingElement.width){
                this.siblingElement.setAttribute('class', this.siblingElement.class)
                this.siblingElement.style.width = this.siblingElement.width+'px'
                this.siblingElement.style.visibility = 'visible'
            } else {
                this.siblingElement.removeAttribute('class')
                this.siblingElement.style.width = '0'
                this.siblingElement.style.visibility = 'hidden'
            }
        }
    }
}