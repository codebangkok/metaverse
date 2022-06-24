import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import { VRButton } from "./VRButton.js";

//Event
window.addEventListener("resize", onWindowResize);

//Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x34aeeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//Control
const controls = new OrbitControls(camera, renderer.domElement);

//VR
const vrButton = VRButton.createButton(renderer);
document.body.appendChild(vrButton);
renderer.xr.enabled = true;

//Light
const ambientLight = new THREE.AmbientLight(0xbda355);
const directionalLight = new THREE.DirectionalLight(0xffffff);
ambientLight.add(directionalLight);
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader();

//Ground
const groundTexture = textureLoader.load("src/textures/grasslight-big.jpg");
groundTexture.repeat.set(1000, 1000);
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.encoding = THREE.sRGBEncoding;
const groundGeometry = new THREE.PlaneGeometry(16000, 16000);
const groundMaterial = new THREE.MeshPhongMaterial({map: groundTexture});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotateX(-Math.PI/2);
scene.add(groundMesh);

//Box
const boxTexture = textureLoader.load("src/textures/crate.gif");
const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
const boxMaterial = new THREE.MeshPhongMaterial({map: boxTexture});
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.translateY(10).translateZ(-30);
scene.add(boxMesh);

//Cone
const coneTexture = textureLoader.load("src/textures/hardwood2_diffuse.jpg");
const coneGeometry = new THREE.ConeGeometry(5, 20, 32);
const coneMaterial = new THREE.MeshPhongMaterial({map: coneTexture});
const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
coneMesh.translateX(-25).translateY(15).translateZ(-30);
scene.add(coneMesh);

//Cylinder
const cylinderTexture = textureLoader.load("src/textures/hardwood2_roughness.jpg");
const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
const cylinderMaterial = new THREE.MeshPhongMaterial({map: cylinderTexture});
const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinderMesh.translateX(25).translateY(15).translateZ(-30);
scene.add(cylinderMesh);

camera.translateZ(40).translateY(5);


function animate() {

    boxMesh.rotateX(0.005);
    boxMesh.rotateY(0.01);

    coneMesh.rotateX(0.005);
    coneMesh.rotateY(0.01);

    cylinderMesh.rotateX(0.005);
    cylinderMesh.rotateY(0.01);

    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}