import * as THREE from "https://unpkg.com/three@0.128.0/build/three.module.js";

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

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("./assets/earthmap.jpg"); // Use a publicly available texture

const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const locations = [
  { lat: -34.6037, lon: -58.3816 }, // Example: Buenos Aires, Argentina
  { lat: 40.7128, lon: -74.006 }, // Example: New York, USA
  { lat: 35.6895, lon: 139.6917 }, // Example: Tokyo, Japan
  { lat: 51.5074, lon: -0.1278 }, // Example: London, UK
  { lat: 48.8566, lon: 2.3522 }, // Example: Paris, France
  { lat: 55.7558, lon: 37.6173 }, // Example: Moscow, Russia
  { lat: -33.8688, lon: 151.2093 }, // Example: Sydney, Australia
  { lat: 19.4326, lon: -99.1332 }, // Example: Mexico City, Mexico
  { lat: 39.9042, lon: 116.4074 }, // Example: Beijing, China
];

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

function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.005; // Rotates the Earth for the spinning effect
  renderer.render(scene, camera);
}

animate();
