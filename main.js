import * as THREE from "three";
import createLabelTexture from "./createLabelTexture.js";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let INTERSECTED = null;

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
    flag: "./assets/flags/netherlands.png",
    position: {
      lat: 52.2129919,
      lon: 5.2793703,
    },
  }, // Netherlands
  {
    name: "Belgium",
    flag: "./assets/flags/belgium.png",
    position: {
      lat: 50.5010789,
      lon: 4.4764595,
    },
  }, // Belgium
  {
    name: "Germany",
    flag: "./assets/flags/germany.png",
    position: {
      lat: 51.1642292,
      lon: 10.4541194,
    },
  }, // Germany
  {
    name: "Austria",
    flag: "./assets/flags/austria.png",
    position: {
      lat: 47.6964719,
      lon: 13.3457347,
    },
  }, // Austria
  {
    name: "Sweden",
    flag: "./assets/flags/sweden.png",
    position: {
      lat: 62.1983366,
      lon: 17.5671981,
    },
  }, // Sweden
  {
    name: "Finland",
    flag: "./assets/flags/finland.png",
    position: {
      lat: 64.9146659,
      lon: 26.0672554,
    },
  }, // Finland
  {
    name: "Norway",
    flag: "./assets/flags/norway.png",
    position: {
      lat: 64.5783089,
      lon: 17.888237,
    },
  }, // Norway
  {
    name: "Denmark",
    flag: "./assets/flags/denmark.png",
    position: {
      lat: 55.9396761,
      lon: 9.5155848,
    },
  }, // Denmark
  {
    name: "UK",
    flag: "./assets/flags/uk.png",
    position: {
      lat: 55.3617609,
      lon: -3.4433238,
    },
  }, // UK
];

const markers = [];
const labels = new Map();

for (const location of locations) {
  const { lat, lon } = location.position;
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const geometry = new THREE.SphereGeometry(0.1, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const marker = new THREE.Mesh(geometry, material);

  const posX = -5 * Math.sin(phi) * Math.cos(theta);
  const posY = 5 * Math.cos(phi);
  const posZ = 5 * Math.sin(phi) * Math.sin(theta);

  marker.position.x = posX;
  marker.position.y = posY;
  marker.position.z = posZ;

  earth.add(marker);

  const label = await createLabelTexture(location.name, location.flag);
  label.visible = false;
  label.position.set(posX, posY + 1, posZ);
  scene.add(label);

  markers.push(marker);
  labels.set(marker, label);
}

camera.position.z = 10;

// Instantiate the OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// Adjust controls settings
controls.enableDamping = true; // Optional, but this gives a smoother control feel
controls.dampingFactor = 0.05;

renderer.domElement.addEventListener("click", onDocumentMouseDown, false);
function onDocumentMouseDown(event) {
  event.preventDefault();

  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(markers);

  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED) labels.get(INTERSECTED).visible = false; // Hide the previous tooltip

      INTERSECTED = intersects[0].object;
      labels.get(INTERSECTED).visible = true; // Show the new tooltip
    }
  } else {
    if (INTERSECTED) labels.get(INTERSECTED).visible = false; // Hide the tooltip when clicking elsewhere
    INTERSECTED = null;
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  labels.forEach((label, marker) => {
    if (label.visible) {
      // Calculate the new position for the label
      const newPosition = marker.position
        .clone()
        .add(new THREE.Vector3(0, 0.5, 0)); // Adjust the Y-offset as needed
      label.position.copy(newPosition);
    }
  });

  renderer.render(scene, camera);
}

animate();
