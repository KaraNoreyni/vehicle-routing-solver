export class tabControl extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.labels = Array.from(
            this.querySelectorAll('tab-label'))

        this.container = document.querySelector(
            `#${this.getAttribute('for')}`)
        this.container.controler = this
        this.selectionIndicator = document.createElement('div')
        this.selectionIndicator.style.position = 'absolute'
        this.selectionIndicator.style.bottom = '-2px'
        this.selectionIndicator.style.left = '0'
        this.selectionIndicator.style.width = '1px'
        this.selectionIndicator.style.height = '2px'
        this.selectionIndicator.style.backgroundColor = 'black'
        this.selectionIndicator.style.transformOrigin = 'left'
        this.selectionIndicator.style.transition = 'transform 0.17s ease 0.075s'

        this.appendChild(this.selectionIndicator)
    }
}
export class tabLabel extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.controler = this.parentElement
        this.panel = this.controler.container.querySelector(
            `tab-panel[content=${this.getAttribute('content')}`)
        this.addEventListener('click', function() {
            this.controler.labels.filter(
                label => label.panel.hasAttribute('show')
                ).forEach(label => label.panel.removeAttribute(
                    'show'))
            
            this.controler.selectionIndicator.style.transform = `
            translateX(${this.getBoundingClientRect().x - this.controler.getBoundingClientRect().x}px)
            scaleX(${this.offsetWidth})
            `
            this.panel.setAttribute('show', '')
        }) 
    }
}

export class tabPanel extends HTMLElement {
    constructor() {
        super()
    }
    static get observedAttributes() {
        return ['show']
    }
    connectedCallback() {
        this.container = this.parentElement
        this.width = this.getBoundingClientRect().width


        this.style.display = this.hasAttribute('show') ?
            '' :
            'none'
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'show') {
            this.hasAttribute('show') ?
                this.style.display = '' :
                this.style.display = 'none'
        }
    }
}


export class tabControlTest extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.labels = Array.from(
            this.querySelectorAll('tab-label'))

        this.container = document.querySelector(
            `#${this.getAttribute('for')}`)
        this.container.controler = this
        this.selectionIndicator = document.createElement('div')
        this.selectionIndicator.style.position = 'absolute'
        this.selectionIndicator.style.bottom = '-2px'
        this.selectionIndicator.style.left = '0'
        this.selectionIndicator.style.width = '1px'
        this.selectionIndicator.style.height = '2px'
        this.selectionIndicator.style.backgroundColor = 'black'
        this.selectionIndicator.style.transformOrigin = 'left'
        this.selectionIndicator.style.transition = 'transform 0.17s ease 0.075s'

        this.appendChild(this.selectionIndicator)
    }
}
export class tabLabelTest extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.controler = this.parentElement
        this.panel = this.controler.container.querySelector(
            `tab-panel[content=${this.getAttribute('content')}`)
        this.onclick = function() {
            this.controler.labels.filter(
                label => label.panel.hasAttribute('show')
                ).forEach(label => label.panel.removeAttribute(
                    'show'))
            
            this.controler.selectionIndicator.style.transform = `
            translateX(${this.getBoundingClientRect().x - this.controler.getBoundingClientRect().x}px)
            scaleX(${this.offsetWidth})
            `
            this.panel.setAttribute('show', '')
        }
    }
}

export class tabPanelTest extends HTMLElement {
    constructor() {
        super()
    }
    static get observedAttributes() {
        return ['show']
    }
    connectedCallback() {
        this.container = this.parentElement
        this.width = this.getBoundingClientRect().width


        this.style.display = this.hasAttribute('show') ?
            '' :
            'none'
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'show') {
            this.hasAttribute('show') ?
                this.style.display = '' :
                this.style.display = 'none'
        }
    }
}
