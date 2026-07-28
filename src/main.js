import * as THREE from 'three'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { World } from './world.js'
import { FPControls } from './controls.js'
import { Flow } from './flow.js'
import './style.css'

const app = document.getElementById('app')

// --- WebGL Renderer (Maschine, Boden) ---
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
app.appendChild(renderer.domElement)

// --- CSS3D Renderer (Spatial UI) ---
const cssRenderer = new CSS3DRenderer()
cssRenderer.setSize(window.innerWidth, window.innerHeight)
cssRenderer.domElement.classList.add('css3d')
app.appendChild(cssRenderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.05,
  100
)
camera.position.set(0, 1.65, 4.6)

const world = new World(scene)
const controls = new FPControls(camera, renderer.domElement)
controls.position.copy(camera.position)

// --- Toast (Screen-Space-Hinweis) ---
const toastEl = document.getElementById('toast')
let toastTimer = null
function toast(message) {
  toastEl.textContent = message
  toastEl.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200)
}

const flow = new Flow({ scene, camera, controls, world, toast })

// Debug-Zugriff für die Entwicklung
window.__world = world
window.__flow = flow
window.__THREE = THREE

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  cssRenderer.setSize(window.innerWidth, window.innerHeight)
})

const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)
  const dt = Math.min(clock.getDelta(), 0.05)
  controls.update(dt)
  world.update(clock.elapsedTime)
  flow.update(dt)
  renderer.render(scene, camera)
  cssRenderer.render(scene, camera)
}

animate()
