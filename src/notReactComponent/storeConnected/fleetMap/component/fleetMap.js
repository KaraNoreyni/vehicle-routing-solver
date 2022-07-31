import { Store } from "../../../../reducer";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { setRoutes } from "../actions/setOptimizedRoutes.js";

export class fleetMap extends HTMLElement {
    constructor() {
        super()
        this._fleet = Store.getState().fleet
        this._fleetLocation = Store.getState().jobs[0].deliveries[0].places[0].location
        this._jobs = Store.getState().jobs
        this.routes = Store.getState().mapRoute
        Store.subscribe(() => {

          if (this.fleetLocation != 
            Store.getState().jobs[0].deliveries[0].places[0].location) {
            this.fleetLocation = Store.getState().jobs[0].deliveries[0].places[0].location
          }
          if(this.jobs != 
            Store.getState().jobs) {
              this.jobs = Store.getState().jobs
          }
          if(Store.getState().mapRoute != this.routes) {
            setRoutes(Store.getState().mapRoute, this.googleMap)
          }
        })
    }
    get fleet() {
      return this._fleet
    }
    set fleet(newValue) {
      this._fleet = newValue
    }
    get fleetLocation() {
      return this._fleetLocation
    }
    set fleetLocation(newValue) {
      this._fleetLocation = newValue
      this.googleMap.setCenter({
          lat: this.fleetLocation.lat,
          lng: this.fleetLocation.lng
      })

      this.fleetMarker.setMap(null)
      this.fleetMarker = new window.google.maps.Marker({
        position : {
          lat: this.fleetLocation.lat,
          lng: this.fleetLocation.lng,
        },
        map: this.googleMap
      })
    }

    get jobs() {
      return this._jobs
    }
    set jobs(newValue) {
      this._jobs = newValue
      this.jobsMarkers.forEach(
        marker => marker.setMap(null));
      this.jobsMarkers = this.jobs.slice(1).map((job) => {
        const location = job.deliveries[0].places[0].location
        return new window.google.maps.Marker({
          position : {
            lat: location.lat,
            lng: location.lng,
          },
          map: this.googleMap
        })
      })
    }

    connectedCallback() {
      this.mapDiv = document.createElement('div')
      this.style.display = 'block';
      this.style.height = '650px';
      this.style.width = '100%';
      this.mapOptions =  {
        mapId: "6f988384540e17a4",
        center: {
          lat: this.fleetLocation.lat,
          lng: this.fleetLocation.lng
        },
        zoom: 17, 
        disableDefaultUI: true,
        tilt: 50,
        heading:50,
    }
      
      this.googleMap = new window.google.maps.Map(this, this.mapOptions)
    
      this.fleetMarker = new window.google.maps.Marker({
        position : {
          lat: this.fleetLocation.lat,
          lng: this.fleetLocation.lng,
        },
        map: this.googleMap
      })
    
      this.jobsMarkers = this.jobs.slice(1).map((job) => {
        const location = job.deliveries[0].places[0].location
        return new window.google.maps.Marker({
          position : {
            lat: location.lat,
            lng: location.lng,
          },
          map: this.googleMap
        })
      })
      this.webGLOverlayView = new window.google.maps.WebGLOverlayView()
        this.webGLOverlayView.onAdd = () => {
            this.scene = new THREE.Scene()
            this.camera = new THREE.PerspectiveCamera()
            const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 );
            this.scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
            directionalLight.position.set(0.5, -1, 0.5);
            this.scene.add(directionalLight);

            this.loader = new GLTFLoader()

            const source = "pin.gltf"
            this.loader.load(
                source,
                gltf => {
                    console.log(gltf)
                    gltf.scene.scale.set(25,25,25);
                    gltf.scene.rotation.x = 180 * Math.PI/180;
                    this.scene.add(gltf.scene)
                }
            )
        };
        this.webGLOverlayView.onContextRestored = ({gl}) => {
            this.renderer = new THREE.WebGLRenderer({
                canvas: gl.canvas,
                context: gl,
                ...gl.getContextAttributes()
            });
            this.renderer.autoClear = false
            this.loader.manager.onLoad = () => {
                this.renderer.setAnimationLoop(() =>{
                    this.googleMap.moveCamera({
                        'tilt': this.mapOptions.tilt,
                        'heading': this.mapOptions.heading,
                        'zoom': this.mapOptions.zoom
                    })
                    if (this.mapOptions.tilt < 67.5) {
                        this.mapOptions.tilt += 12
                    } else if (this.mapOptions.heading <= 360) {
                        this.mapOptions.heading += 6;
                    } else {
                      this.renderer.setAnimationLoop(null)
                    }
                })
            }
            console.log(this.renderer)
        };
        this.webGLOverlayView.onDraw = ({gl, transformer}) => {
            this.webGLOverlayView.requestRedraw();
            this.renderer.render(this.scene, this.camera)
            this.renderer.resetState()

            const latLngAltitudeLiteral = {
                lat: this.fleetLocation.lat,
                lng: this.fleetLocation.lng,
                altitude: 120
            }
            const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
            this.camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix)
        };
        this.webGLOverlayView.setMap(this.googleMap)
    }
}

