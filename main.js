import * as THREE from "three";
import createLabelTexture from "./createLabelTexture.js";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

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
  {
    name: "Netherlands",
    flag: "https://latitude.to/img/flags/at.png",
    position: {
      lat: 52.2129919,
      lon: 5.2793703,
    },
  }, // Netherlands
  {
    name: "Belgium",
    flag: "https://latitude.to/img/flags/at.png",
    position: {
      lat: 50.5010789,
      lon: 4.4764595,
    },
  }, // Belgium
  {
    name: "Germany",
    flag: "https://latitude.to/img/flags/at.png",
    position: {
      lat: 51.1642292,
      lon: 10.4541194,
    },
  }, // Germany
  {
    name: "Austria",
    flag: "https://latitude.to/img/flags/at.png",
    position: {
      lat: 47.6964719,
      lon: 13.3457347,
    },
  }, // Austria
  {
    name: "Sweden",
    flag: "https://latitude.to/img/flags/at.png",
    position: {
      lat: 62.1983366,
      lon: 17.5671981,
    },
  }, // Sweden
  {
    name: "Finland",
    flag: "https://latitude.to/img/flags/at.png",
    position: {
      lat: 64.9146659,
      lon: 26.0672554,
    },
  }, // Finland
  {
    name: "Norway",
    flag: "https://latitude.to/img/flags/at.png",
    position: {
      lat: 64.5783089,
      lon: 17.888237,
    },
  }, // Norway
  {
    name: "Denmark",
    flag: "https://latitude.to/img/flags/at.png",
    position: {
      lat: 55.9396761,
      lon: 9.5155848,
    },
  }, // Denmark
  {
    name: "UK",
    flag: "https://latitude.to/img/flags/at.png",
    position: {
      lat: 55.3617609,
      lon: -3.4433238,
    },
  }, // UK
];

for (const location of locations) {
  const { lat, lon } = location.position;
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const geometry = new THREE.SphereGeometry(0.1, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const marker = new THREE.Mesh(geometry, material);

  marker.position.x = -5 * Math.sin(phi) * Math.cos(theta);
  marker.position.y = 5 * Math.cos(phi);
  marker.position.z = 5 * Math.sin(phi) * Math.sin(theta);

  earth.add(marker);

  const labelTexture = await createLabelTexture(location.name, location.flag);
  const labelMaterial = new THREE.SpriteMaterial({
    map: labelTexture,
    transparent: true,
  });
  const label = new THREE.Sprite(labelMaterial);
  label.scale.set(3, 0.75, 1);
  label.position.set(
    marker.position.x,
    marker.position.y + 1,
    marker.position.z
  );
  scene.add(label);
}

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
