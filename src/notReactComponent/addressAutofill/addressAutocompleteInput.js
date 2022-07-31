const mapboxsearch = require('@mapbox/search-js-web')

export default class addressAutofill extends HTMLInputElement {
    constructor () {
        super()
    }
    connectedCallback () {
        if (!(window.autofillCollection)) {
            window.autofillCollection = mapboxsearch.autofill({
                accessToken: 'pk.eyJ1Ijoibm9ub3hyIiwiYSI6ImNsMWVzYjltZTBlOGYzbHJ0aDR0dWF1YnIifQ.D5aikefubzaFf4QbKfNfWg'
            })
        } else {
            window.autofillCollection.update()
        }
    }
}