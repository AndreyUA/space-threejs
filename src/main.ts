import "./style.css";

import * as THREE from "three";
import GUI from "lil-gui";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Debug
let gui: GUI | null = null;
const currentUrl = window.location.href;
if (currentUrl.includes("debug")) {
  gui = new GUI();
}

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

// Textures
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/4.png");

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  10
);
camera.rotateX(Math.PI / 2);
camera.rotateY(Math.PI / 2);
camera.position.z = 17.5;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Resize listener
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Particles
const particlesGeometry = new THREE.BufferGeometry(); // Custom geometry
const count = 600_000;
const arrayLength = count * 3;
const positionsArray = new Float32Array(arrayLength);
const colorsArray = new Float32Array(arrayLength);

// Fill the geometry and color arrays with random values
for (let i = 0; i < arrayLength; i += 3) {
  // Define random positions in a circle
  const theta = Math.random() * 2 * Math.PI; // Random angle between 0 and 2π
  // ! random value formula: Math.random() * (max - min) + min
  const r = Math.random() * 25 + 5; // Random radius between 30 and 5

  // Define random positions
  // x
  positionsArray[i] = r * Math.cos(theta);
  // y
  positionsArray[i + 1] = (Math.random() - 0.5) * 10;
  // z
  positionsArray[i + 2] = r * Math.sin(theta);

  // Define random colors
  colorsArray[i] = Math.random();
  colorsArray[i + 1] = Math.random();
  colorsArray[i + 2] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionsArray, 3)
);
particlesGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colorsArray, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  vertexColors: true,
  transparent: true,
  alphaMap: particleTexture,
  depthTest: false,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// ! Animation
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Render
  renderer.render(scene, camera);

  // Particles rotation
  particles.rotation.y = elapsedTime * 0.1;

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
