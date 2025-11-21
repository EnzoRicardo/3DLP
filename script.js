import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/RGBELoader.js";

// Cena
const scene = new THREE.Scene();


// Camera
const camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0.5, 10);

// Render
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;   
renderer.toneMappingExposure = 1.2;                   
renderer.outputEncoding = THREE.sRGBEncoding;         

document.getElementById('container3D').appendChild(renderer.domElement);

// === ILUMINAÇÃO AMBIENTE (HDRI) ===
new RGBELoader().load(
    "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr",
    (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
    }
);

// Luzes extras (suave)
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 1.5);
dir.position.set(3, 5, 3);
scene.add(dir);

// === Carregar o modelo ===
let car;
const loader = new GLTFLoader();

loader.load(
    "/models/car2.glb",
    (gltf) => {
        car = gltf.scene;
        car.position.set(0, -0.3, 0);
        car.rotation.y = Math.PI;
        car.scale.set(1.0, 1.0, 1.0);

        scene.add(car);
    }
);

// === Loop ===
function animate() {
    requestAnimationFrame(animate);

    if (car) {
        car.rotation.y += 0.0070;
    }

    renderer.render(scene, camera);
}
animate();

// === Responsivo ===
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
