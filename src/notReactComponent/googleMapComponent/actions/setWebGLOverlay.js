import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export function setWebGLOverlay(google, target) {
    target.webGLOverlayView = new google.maps.WebGLOverlayView()
    target.webGLOverlayView.onAdd = () => {
        target.scene = new THREE.Scene()
        target.camera = new THREE.PerspectiveCamera()
        const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 );
        target.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
        directionalLight.position.set(0.5, -1, 0.5);
        target.scene.add(directionalLight);

        target.loader = new GLTFLoader()

        const source = "pin.gltf"
        target.loader.load(
            source,
            gltf => {
                console.log(gltf)
                gltf.scene.scale.set(25,25,25);
                gltf.scene.rotation.x = 180 * Math.PI/180;
                target.scene.add(gltf.scene)
            }
        )
    };
    target.webGLOverlayView.onContextRestored = ({gl}) => {
        target.renderer = new THREE.WebGLRenderer({
            canvas: gl.canvas,
            context: gl,
            ...gl.getContextAttributes()
        });
        target.renderer.autoClear = false
        target.loader.manager.onLoad = () => {
            target.renderer.setAnimationLoop(() =>{
                target.googleMap.moveCamera({
                    'tilt': target.mapOptions.tilt,
                    'heading': target.mapOptions.heading,
                    'zoom': target.mapOptions.zoom
                })
                if (target.mapOptions.tilt < 67.5) {
                    target.mapOptions.tilt += 12
                } else if (target.mapOptions.heading <= 360) {
                    target.mapOptions.heading += 6;
                } else {
                  target.renderer.setAnimationLoop(null)
                }
            })
        }
        console.log(target.renderer)
    };
    target.webGLOverlayView.onDraw = ({gl, transformer}) => {
        target.webGLOverlayView.requestRedraw();
        target.renderer.render(target.scene, target.camera)
        target.renderer.resetState()

        const latLngAltitudeLiteral = {
            lat: target.fleetLocation.lat,
            lng: target.fleetLocation.lng,
            altitude: 120
        }
        const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
        target.camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix)
    };
    target.webGLOverlayView.setMap(target.googleMap)
}