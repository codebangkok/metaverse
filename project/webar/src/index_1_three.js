import * as THREE from "./libs/three.module.js"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1)
scene.add(light)

const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06)
const material = new THREE.MeshPhongMaterial({color: 0x00ff00})
const mesh = new THREE.Mesh(geometry, material)
mesh.translateZ(-0.5)
scene.add(mesh)

renderer.setAnimationLoop(() => {
    mesh.rotateX(0.005)
    mesh.rotateY(0.01)

    renderer.render(scene, camera)
})