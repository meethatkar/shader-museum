import * as THREE from 'three'
import './style.css'
import vertexShader from './vertex.glsl?raw'
import fragmentShader from './fragment.glsl?raw'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import Lenis from 'lenis'

const lenis = new Lenis({
  duration: 1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
lenis.on('scroll', ScrollTrigger.update);

// 1. Create the scene
const scene = new THREE.Scene()

// 2. Create a camera
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 3

// 3. Create the renderer
const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 4. Add a simple cube
const geometry = new THREE.PlaneGeometry(4, 4, 200, 200);

const uniforms = {
  uTime: { value: 0 },
  uNoiseScale: { value: 0.5 },
  uIntensity: { value: 0.2 },
  uColorMix: { value: 0.0 }
};

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
  wireframe: false,
  side: THREE.DoubleSide,
})
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, 0);
scene.add(cube);

// SETTING INTIAL STATES
gsap.set(uniforms.uColorMix, { value: 0 })
gsap.set(uniforms.uNoiseScale, { value: 0.5 })
gsap.set(uniforms.uIntensity, { value: 0.2 });

// SCROLLTIGGER CODE
// Start scale effect
gsap.timeline({
  scrollTrigger:{
    trigger: ".art-0",
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: true,
  }
})
  .to("#heading", { 
    scale: 2,
    ease: "power2.out",
    opacity: 0,
  })

// Pulse Effect
gsap.timeline({
  scrollTrigger: {
    trigger: ".art-1",
    start: "top top",
    end: "bottom center",
    scrub: true
  }
})
  .to(uniforms.uNoiseScale, { value: 0.5 })
  .to(uniforms.uIntensity, { value: 0.9 }, "<")
  .to(uniforms.uColorMix, { value: -0.2 }, "<")

// distortation
gsap.timeline({
  scrollTrigger: {
    trigger: ".art-2",
    start: "top center",
    end: "bottom center",
    scrub: true
  }
})
  .to(uniforms.uNoiseScale, { value: 3.0 })
  .to(uniforms.uIntensity, { value: 0.45 }, "<")
  .to(uniforms.uColorMix, { value: 0.2 }, "<")


// flow
gsap.timeline({
  scrollTrigger: {
    trigger: ".art-3",
    start: "top center",
    end: "bottom center",
    scrub: true,
  }
})
  .to(uniforms.uNoiseScale, { value: 1.2 })
  .to(uniforms.uIntensity, { value: 0.25 }, "<")
  .to(uniforms.uColorMix, { value: 0.6 }, "<")

// slience
gsap.timeline({
  scrollTrigger: {
    trigger: ".art-4",
    start: "top bottom",
    end: "bottom bottom",
    scrub: true,
  }
})
  .to(uniforms.uNoiseScale, { value: 0.1 })
  .to(uniforms.uIntensity, { value: 0.05 }, "<")
  .to(uniforms.uColorMix, { value: 1.0 }, "<")
ScrollTrigger.refresh()


const clock = new THREE.Clock();

// 5. Animation loop
function animate(time) {
  requestAnimationFrame(animate)
  uniforms.uTime.value = clock.getElapsedTime();
  cube.rotation.z += Math.sin(0.001);
  lenis.raf(time);
  renderer.render(scene, camera);
}
animate();

function updateCameraForMobile() {
    // Agar screen chi width 768px peksha kami aahe (Mobile)
    if (window.innerWidth < 768) {
        camera.position.z = 6;  // Camera khup mage ghyava lagel (Zoom out)
        cube.scale.set(0.7, 0.7, 0.7); // Object thoda chota kara
    } else {
        // Desktop settings (Normal)
        camera.position.z = 3;
        cube.scale.set(1, 1, 1);
    }
}
updateCameraForMobile();

// 6. Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateCameraForMobile();
})