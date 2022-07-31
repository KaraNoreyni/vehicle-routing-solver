import { Store } from '../../../reducer';
import { travelMaker } from './actions/travelMaker';


Date.prototype.addMinutes = function(minutes) {
  var copiedDate = new Date(this.getTime());
  return new Date(copiedDate.getTime() + minutes * 60000);
}

export class mapRoute extends HTMLElement {
    constructor () {
        super()
        this.mapDiv = document.createElement('div')
        this.base = Store.getState().jobs[0].deliveries[0].places[0].location
    }
    get mapRoute() {
        return this._mapRoute
    }
    set mapRoute(newValue) {
        this._mapRoute = newValue
        travelMaker(this.googleMap, this.mapRoute)
    }
    connectedCallback() {
        Store.subscribe(() => {
            if (Store.getState().mapRoute[this.mapIndex] != this.mapRoute) {
                this.mapRoute = Store.getState().mapRoute[this.mapIndex]
            }
        })

        this.mapIndex = this.getAttribute('mapIndex')
        this._mapRoute = Store.getState().mapRoute[this.mapIndex]
        const center = this.mapRoute.center
        const zoom = this.mapRoute.zoom
        this.mapOptions =  {
            mapId: "6f988384540e17a4",
            center,
            zoom,
            disableDefaultUI: true,
            tilt: 0,
            heading:0,
        }
        this.googleMap = new window.google.maps.Map(this.mapDiv, this.mapOptions)
        
        this.jobberHeader = document.createElement('div')
        this.jobberHeader.classList.add('fill', 'mapContainer', 'rootFont', 'boldTitle')
        this.jobberHeader.textContent = this.mapRoute.route.vehicleId

        this.appendChild(this.mapDiv)
        this.googleMap.controls[window.google.maps.ControlPosition.TOP_CENTER].push(this.jobberHeader)
        travelMaker(this.googleMap, this.mapRoute)
        console.log(travelMaker, this.googleMap, this.mapRoute)
        //travelMaker(this.googleMap, this.mapRoute)
    }
    
}



export class mapRouteList extends HTMLElement {
    constructor () {
        super()
        this._mapRoutes = Store.getState().mapRoute
    }
    get mapRoutes () {
        return this._mapRoutes
    }
    set mapRoutes (newMapRoutes) {
        this._mapRoutes = newMapRoutes
        this.render()
    }
    connectedCallback() {
        this.render()
        Store.subscribe(() => {
            if (Store.getState().mapRoute != this.mapRoutes) {
                this.mapRoutes = Store.getState().mapRoute
            }
        })
    }
    render() {
        if (this.mapRoutes != undefined) {
            this.innerHTML = `
            ${this.mapRoutes.map(mapRoute => {
                return `
                <map-route mapIndex=${mapRoute.id}></map-route>`
            })}
            `
        }
    }
}


  