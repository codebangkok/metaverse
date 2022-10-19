import * as THREE from "./libs/three.module.js"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera()
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

const arButton = document.getElementById("ar-button")
if (navigator.xr) {
    const supported = await navigator.xr.isSessionSupported("immersive-ar")
    console.log(supported)
    if (!supported) {
        arButton.disabled = true
    }
} else {
    arButton.disabled = true
}

arButton.addEventListener("click", async () => {

    const session = await navigator.xr.requestSession("immersive-ar", {
        optionalFeatures: ["dom-overlay", "local-floor"],
        domOverlay: {
            root: document.body
        }
    })

    await renderer.xr.setSession(session)
    renderer.xr.enabled = true
    arButton.hidden = true
})

// renderer.setAnimationLoop(() => {
//     renderer.render(scene, camera)
// })