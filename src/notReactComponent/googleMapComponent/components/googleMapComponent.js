import { Loader } from "@googlemaps/js-api-loader"
import { setWebGLOverlay } from "../actions/setWebGLOverlay";
import { setGoogleMap } from "../actions/setGoogleMap";

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
                apiKey: "",
                version: "weekly",
                libraries: ["places"]
            })
            this.googleMapAPI = await this.googleMapAPILoader.load().then(
                () => this.Status = Status.SUCCESS,
                () => this.Status = Status.FAILURE
            ).then(

            )
            if (this.Status === Status.SUCCESS && this.googleMapComponents) {
                console.log(setGoogleMap)
                console.log(this.googleMapComponents)
                this.googleMapComponents.forEach(map => setGoogleMap(map))
            }
        }
    }
}


export class googleMapComponent extends HTMLElement {
    constructor() {
        super()
        this._googleMap = null
        this.mapOptions =  {
            mapId: "6f988384540e17a4",
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



