//import { setWebGLOverlay } from "../actions/setWebGLOverlay.js";
import { setGoogleMap } from "../actions/setGoogleMap";
import { Loader } from "@googlemaps/js-api-loader"

const Status = {
    LOADING: "LOADING",
    FAILURE: "FAILURE",
    SUCCESS: "SUCCESS"
}

export class googleMapLoader extends HTMLElement {
    constructor() {
        super()
    }
    async connectedCallback() {
        this.googleMapComponents = Array.from(this.querySelectorAll(
            'test-google-map-component, fleet-map'))

        if (!window.google){
            this.Status = Status.LOADING

            this.googleMapAPILoader = new Loader({
                apiKey: "AIzaSyCC-wNU3s8EZpAIP0Rdbp7M1w_9nriMeok",
                version: "weekly",
                libraries: ["places"]
            })
            this.googleMapAPI = await this.googleMapAPILoader.load().then(
                () => this.Status = Status.SUCCESS,
                () => this.Status = Status.FAILURE
            ).then(() => {
                if (this.Status === Status.SUCCESS) {
                    this.googleMapComponents.forEach(map => map.connectedCallback())
                }}
            )

        }
    }
}


export class googleMapComponent extends HTMLElement {
    constructor() {
        super()
        this._googleMap = null
        this.mapOptions =  {
            mapId: "6f988384540e17a4",
            center: {
              lat: 45.7756392,
              lng: 4.8037335

            },
            zoom: 17, 
            disableDefaultUI: true,
            tilt: 50,
            heading:50,
        }
    }
    get googleMap() {
        return this._googleMap
    }
    set googleMap(map) {
        this._googleMap = map
    }

    connectedCallback() {
        if(window.google != undefined) {
            setGoogleMap(this)
        }
    }
}
export class googleMapWithWebGLOverlayView extends googleMapComponent {
    constructor() {
        super()
    }
    connectedCallback() {
        setWebGLOverlay(this.googleMapAPI, this)
    }
}



