import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import { VRButton } from "./VRButton.js";
import abi from "./abi/metaverse.json" assert {type: "json"};

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

// //Box
// const boxTexture = textureLoader.load("src/textures/crate.gif");
// const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
// const boxMaterial = new THREE.MeshPhongMaterial({map: boxTexture});
// const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// boxMesh.translateY(10).translateZ(-30);
// scene.add(boxMesh);

// //Cone
// const coneTexture = textureLoader.load("src/textures/hardwood2_diffuse.jpg");
// const coneGeometry = new THREE.ConeGeometry(5, 20, 32);
// const coneMaterial = new THREE.MeshPhongMaterial({map: coneTexture});
// const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
// coneMesh.translateX(-25).translateY(15).translateZ(-30);
// scene.add(coneMesh);

// //Cylinder
// const cylinderTexture = textureLoader.load("src/textures/hardwood2_roughness.jpg");
// const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
// const cylinderMaterial = new THREE.MeshPhongMaterial({map: cylinderTexture});
// const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
// cylinderMesh.translateX(25).translateY(15).translateZ(-30);
// scene.add(cylinderMesh);

camera.translateZ(40).translateY(5);


function animate() {

    // boxMesh.rotateX(0.005);
    // boxMesh.rotateY(0.01);

    // coneMesh.rotateX(0.005);
    // coneMesh.rotateY(0.01);

    // cylinderMesh.rotateX(0.005);
    // cylinderMesh.rotateY(0.01);

    nfts.forEach((nft) => {
        nft.rotateX(0.005);
        nft.rotateY(0.01);
    });

    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// const web3 = new Web3(Web3.givenProvider || "wss://rinkeby.infura.io/ws/v3/1fabcf12b3e24d3d9fb2c2cf8dd9ebcd");
// const contract = new web3.eth.Contract(abi, "0x0d3416976aE7C5aa394c7B753667bC699830159b");
const web3 = new Web3(Web3.givenProvider || "https://data-seed-prebsc-1-s1.binance.org:8545");
const contract = new web3.eth.Contract(abi, "0x0d3416976aE7C5aa394c7B753667bC699830159b");

const nfts = [];
let items;

if (Web3.givenProvider == null) {    
    items = await contract.methods.items().call();
    console.log(items);
} else {
    const accounts = await web3.eth.requestAccounts();
    console.log(accounts[0]);
    items = await contract.methods.owners().call({from: accounts[0]});
}

items.forEach((item) => {
    let geometry;

    switch (item.itemType) {
        case "1": //Box
            geometry = new THREE.BoxGeometry(item.width, item.height, item.depth);
            break;
        case "2": //Cone
            geometry = new THREE.ConeGeometry(item.radius, item.height, item.radialSegments);
            break;
        case "3": //Cylinder
            geometry = new THREE.CylinderGeometry(item.radius, item.radiusBottom, item.height, item.radialSegments);
            break;
    }

    const texture = textureLoader.load("src/textures/" + item.texture);
    const material = new THREE.MeshPhongMaterial({map: texture});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.translateX(item.x).translateY(item.y).translateZ(item.z);
    nfts.push(mesh);
    scene.add(mesh);
});