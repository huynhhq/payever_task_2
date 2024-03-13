import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Texture loader for the Earth texture
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("./assets/earthmap.jpg");
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Locations array as previously defined
const locations = [
    { lat: 52.2129919, lon: 5.2793703 }, // Netherlands
    { lat: 50.5010789, lon: 4.4764595 }, // Belgium
    { lat: 51.1642292, lon: 10.4541194 }, // Germany
    { lat: 47.6964719, lon: 13.3457347 }, // Austria
    { lat: 62.1983366, lon: 17.5671981 }, // Sweden
    { lat: 64.9146659, lon: 26.0672554 }, // Finland
    { lat: 64.5783089, lon: 17.888237 }, // Norway
    { lat: 55.9396761, lon: 9.5155848 }, // Denmark
    { lat: 55.3617609, lon: -3.4433238 }, // UK
]

locations.forEach((location) => {
    const { lat, lon } = location;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const marker = new THREE.Mesh(geometry, material);

    marker.position.x = -5 * Math.sin(phi) * Math.cos(theta);
    marker.position.y = 5 * Math.cos(phi);
    marker.position.z = 5 * Math.sin(phi) * Math.sin(theta);

    earth.add(marker);
});

camera.position.z = 15;

// Instantiate the OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// Adjust controls settings
controls.enableDamping = true; // Optional, but this gives a smoother control feel
controls.dampingFactor = 0.05;

function animate() {
    requestAnimationFrame(animate);
    // Required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    earth.rotation.y += 0.005; // Rotates the Earth for the spinning effect
    renderer.render(scene, camera);
}

animate();