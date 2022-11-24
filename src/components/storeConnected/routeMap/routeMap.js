import { Store } from '../../../reducer';
import { travelMaker } from './actions/travelMaker';


Date.prototype.addMinutes = function(minutes) {
  var copiedDate = new Date(this.getTime());
  return new Date(copiedDate.getTime() + minutes * 60000);
}

export class mapRoute extends HTMLElement {
    constructor () {
        super()
        this.base = Store.getState().jobs[0].deliveries[0].places[0].location
    }
    get mapRoute() {
        return this._mapRoute
    }
    set mapRoute(newValue) {
        this._mapRoute = newValue
        travelMaker(this.googleMap, this.mapRoute)
    }
    setMap() {
        this.googleMap = new window.google.maps.Map(this, this.mapOptions)
        
        this.jobberHeader = document.createElement('div')
        this.jobberHeader.classList.add('fill', 'mapContainer', 'rootFont', 'boldTitle')
        this.jobberHeader.textContent = this.mapRoute.route.vehicleId

        this.googleMap.controls[window.google.maps.ControlPosition.TOP_CENTER].push(this.jobberHeader)
        travelMaker(this.googleMap, this.mapRoute)
        console.log(travelMaker, this.googleMap, this.mapRoute)
        //travelMaker(this.googleMap, this.mapRoute)
    }
    connectedCallback() {
        console.log('route map connected')
        this.unsubscribe = Store.subscribe(() => {
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
        if (this.getBoundingClientRect().width != 0) {
            this.setMap()
        }
    }
    disconnectedCallback() {
        this.unsubscribe()
    }
    
}

export class routesWrapper extends HTMLElement {
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
        if (this.mapRoutes.length != 0) {
            this.innerHTML = `
                <tab-control 
                    class="flex"
                    for="routes-maps">
                    ${this.mapRoutes.map(mapRoute => {
                        return `
                        <tab-label 
                            content="${mapRoute.route.vehicleId}">
                            ${mapRoute.route.vehicleId}
                        </tab-label>`
                    }).join('')}
                </tab-control>
                <div 
                    class="full-height"
                    id="routes-maps">
                    ${this.mapRoutes.map(mapRoute => {
                        return `
                        <tab-panel
                            class="full-height"
                            style="display: block;"
                            content="${mapRoute.route.vehicleId}">
                            <map-route 
                                style='
                                    display: block;'
                                class='full-height'
                                mapIndex=${mapRoute.id}>
                            </map-route>
                        </tab-panel>`
                    }).join('')}
                </div>
            `
            const tabControl = this.querySelector('tab-control')
            tabControl.labels.forEach(label => {
                const map = label.panel.querySelector('map-route')
                label.addEventListener('click', () => {
                    if(map.googleMap == undefined) {
                        map.setMap()
                    }
                })

            })
        } else {
            this.innerHTML = `Optimiser vos trajets !`
        }
        
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


  