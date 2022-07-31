export class dropdown extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.button = document.querySelector('button')
        this.onclick = (e) => {
            if (!(this.hasAttribute('show'))) {
                this.setAttribute('show', '')
            }else {
                this.removeAttribute('show')
            }
            e.stopPropagation()
        } 
    }
    static get observedAttributes () {
        return ['show']
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'show') {
            const content = this.querySelector('dropdown-content')
            this.hasAttribute('show') ? 
                content.style.visibility = 'visible':
                content.style.visibility = 'hidden'
        }
    }
}
export class dropdownButton extends HTMLButtonElement {
    constructor() {
        super()
    }
}
export class dropdownContent extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.onclick = (e) => {
            const wrappedWrappers = Array.from(
                this.querySelectorAll(
                    'dropdown-wrapper[show=""]'))
            if (!!(wrappedWrappers.length)) {
                wrappedWrappers.forEach(
                    e => e.removeAttribute('show'))
            }
            e.stopPropagation()
        }
    }
}

document.addEventListener('click', (e) => check(e.target))

function check(elm) {
    if (!(elm.closest('dropdown-wrapper'))) {
        Array.from(
            document.querySelectorAll('dropdown-wrapper[show=""]')
                ).forEach(element => {
                    element.removeAttribute('show')})
    }
}