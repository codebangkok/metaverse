import * as THREE from "./libs/three.module.js"
import { ARButton } from "./libs/ARButton.js"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera()
const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

const arButton = ARButton.createButton(renderer)
document.body.appendChild(arButton)

renderer.xr.addEventListener("sessionstart", () => {
    renderer.xr.enabled = true

    const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1)
    scene.add(light)

    const controller = renderer.xr.getController(0)
    scene.add(controller)

    let meshes = []
    controller.addEventListener("select", () => {
        const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06)
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.translateZ(-0.5)
        mesh.applyMatrix4(controller.matrixWorld)
        scene.add(mesh)      
        meshes.push(mesh)  
    })

    renderer.setAnimationLoop(() => {
        meshes.forEach(mesh => {
            mesh.rotateX(0.005)
            mesh.rotateY(0.01)
        })
        renderer.render(scene, camera)
    })
})