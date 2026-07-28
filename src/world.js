import * as THREE from 'three'
import { CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { U } from './units.js'

export const GEAR_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`

const MAT = {
  cream: new THREE.MeshStandardMaterial({ color: 0xe9e4da, roughness: 0.55 }),
  creamDark: new THREE.MeshStandardMaterial({ color: 0xd9d2c6, roughness: 0.6 }),
  wood: new THREE.MeshStandardMaterial({ color: 0xc9a06a, roughness: 0.8 }),
  woodLight: new THREE.MeshStandardMaterial({ color: 0xdec49e, roughness: 0.85 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x2e2c2b, roughness: 0.5 }),
  screen: new THREE.MeshStandardMaterial({
    color: 0xbcd2e8,
    roughness: 0.3,
    emissive: 0x2a3d55,
    emissiveIntensity: 0.4,
  }),
  metal: new THREE.MeshStandardMaterial({ color: 0xcfcfcf, roughness: 0.35, metalness: 0.55 }),
  red: new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.4 }),
  yellow: new THREE.MeshStandardMaterial({ color: 0xe8b93c, roughness: 0.5 }),
  green: new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.5 }),
}

function box(w, h, d, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

function cylinder(rt, rb, h, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 24), mat)
  m.position.set(x, y, z)
  m.castShadow = true
  return m
}

export class World {
  constructor(scene) {
    this.scene = scene
    this.floatGears = []
    this.fires = []

    this.setupLights()
    this.setupGround()

    // Maschinen-Gruppe: zunächst Platzhalter-Boxen, wird durch das
    // GLB-Modell der Holzfräse ersetzt, sobald es geladen ist.
    this.machine = new THREE.Group()
    this.machine.visible = false
    this.placeholder = this.buildMachine()
    this.machine.add(this.placeholder)
    scene.add(this.machine)
    this.loadMachineModel()

    this.gearField = this.buildGearField()
    this.gearField.scale.setScalar(U)
    scene.add(this.gearField)
  }

  setupLights() {
    const hemi = new THREE.HemisphereLight(0xffffff, 0x8d8a85, 1.05)
    this.scene.add(hemi)

    const dir = new THREE.DirectionalLight(0xffffff, 1.6)
    dir.position.set(4 * U, 8 * U, 5 * U)
    dir.castShadow = true
    dir.shadow.mapSize.set(2048, 2048)
    dir.shadow.camera.left = -8 * U
    dir.shadow.camera.right = 8 * U
    dir.shadow.camera.top = 8 * U
    dir.shadow.camera.bottom = -8 * U
    dir.shadow.camera.near = 0.5 * U
    dir.shadow.camera.far = 30 * U
    this.scene.add(dir)
  }

  setupGround() {
    const geo = new THREE.CircleGeometry(30, 48)
    const mat = new THREE.MeshStandardMaterial({
      color: 0xafaeac,
      roughness: 0.95,
      transparent: true,
      opacity: 0.9,
    })
    const ground = new THREE.Mesh(geo, mat)
    ground.rotation.x = -Math.PI / 2
    ground.scale.setScalar(U)
    ground.receiveShadow = true
    this.scene.add(ground)
  }

  /**
   * Lädt die GLB-Modelle (Holzfräse + Bedienpult), normalisiert Größe &
   * Position und ersetzt die Platzhalter-Boxen. Layout wie in den
   * Screenshots: Fräse rechts, Bedienpult links davon, leicht eingedreht.
   */
  loadMachineModel() {
    const loader = new GLTFLoader()

    const loadGLB = (file) =>
      new Promise((resolve, reject) => {
        loader.load(
          `${import.meta.env.BASE_URL}models/${file}`,
          (gltf) => {
            const model = gltf.scene
            model.traverse((o) => {
              if (o.isMesh) {
                o.castShadow = true
                o.receiveShadow = true
              }
            })
            resolve(model)
          },
          undefined,
          reject
        )
      })

    // Modell so normalisieren, dass es auf dem Boden steht und sein
    // Fußabdruck-Zentrum im Ursprung der Wrapper-Gruppe liegt.
    const normalize = (model, targetSize, axis = 'horizontal') => {
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const current =
        axis === 'height' ? size.y : Math.max(size.x, size.z)
      const scale = targetSize / current
      model.scale.setScalar(scale)
      const scaledBox = new THREE.Box3().setFromObject(model)
      const center = scaledBox.getCenter(new THREE.Vector3())
      const wrapper = new THREE.Group()
      wrapper.add(model)
      model.position.set(-center.x, -scaledBox.min.y, -center.z)
      console.log('[world] GLB normalisiert:', {
        rawSize: size.toArray().map((v) => v.toFixed(2)),
        scale: scale.toFixed(4),
      })
      return wrapper
    }

    Promise.allSettled([
      loadGLB('cnc-wooden-001.glb'),
      loadGLB('cnc-control-panel.glb'),
    ]).then(([router, panel]) => {
      if (router.status !== 'fulfilled') {
        console.error('[world] Fräsen-GLB fehlt:', router.reason)
        return
      }
      this.placeholder.removeFromParent()

      // Holzfräse: Länge ≈ 3.2 m, leicht nach rechts versetzt
      this.model = normalize(router.value, 3.2)
      this.model.position.set(0.4, 0, 0)
      this.machine.add(this.model)

      // Control Panel: liegt im GLB flach → aufrichten (rotX 90°),
      // auf Konsolenbreite skalieren und bündig auf die Pult-Front
      // montieren (Front bei z ≈ 1.20, Screen-Zentrum bei ≈ -0.755/1.31).
      if (panel.status === 'fulfilled') {
        const panelModel = panel.value
        const wrapper = new THREE.Group()
        wrapper.add(panelModel)
        panelModel.rotation.x = Math.PI / 2
        let box = new THREE.Box3().setFromObject(wrapper)
        let size = box.getSize(new THREE.Vector3())
        panelModel.scale.setScalar(0.56 / size.x)
        box = new THREE.Box3().setFromObject(wrapper)
        const center = box.getCenter(new THREE.Vector3())
        wrapper.position.set(-0.755 - center.x, 1.31 - center.y, 1.2 - box.min.z)
        this.machine.add(wrapper)
        this.controlPanel = wrapper
      } else {
        console.error('[world] Bedienpult-GLB fehlt:', panel.reason)
      }
    })
  }

  /** Portalfräse mit Frästisch, Werkstück, Portal + separates Bedienpult (Platzhalter/Fallback). */
  buildMachine() {
    const g = new THREE.Group()

    // --- Frästisch ---
    const table = new THREE.Group()
    table.add(box(3.2, 0.16, 1.5, MAT.cream, 0, 0.93, 0))
    table.add(box(3.2, 0.34, 1.35, MAT.wood, 0, 0.68, 0))
    // Beine
    for (const sx of [-1.45, 1.45]) {
      for (const sz of [-0.6, 0.6]) {
        table.add(box(0.18, 1.0, 0.18, MAT.cream, sx, 0.5, sz))
      }
    }
    // Werkstück (Holzplatte mit "Fräsung")
    table.add(box(2.7, 0.09, 1.15, MAT.woodLight, 0, 1.06, 0))
    table.add(box(1.1, 0.02, 0.6, MAT.creamDark, -0.1, 1.115, 0))
    g.add(table)

    // --- Portal ---
    const gantry = new THREE.Group()
    gantry.position.x = 0.45
    gantry.add(box(0.22, 0.85, 0.3, MAT.cream, 0, 1.4, -0.85))
    gantry.add(box(0.22, 0.85, 0.3, MAT.cream, 0, 1.4, 0.85))
    gantry.add(box(0.3, 0.3, 2.0, MAT.metal, 0, 1.78, 0))
    // Spindel
    gantry.add(box(0.26, 0.42, 0.26, MAT.cream, 0, 1.5, 0))
    gantry.add(cylinder(0.07, 0.05, 0.34, MAT.metal, 0, 1.18, 0))
    // Kabelkette
    gantry.add(box(0.1, 0.08, 1.6, MAT.dark, 0, 1.96, 0))
    g.add(gantry)

    // --- Bedienpult ---
    const cabinet = new THREE.Group()
    cabinet.position.set(-2.5, 0, 0.55)
    cabinet.rotation.y = 0.35
    cabinet.add(box(0.85, 0.9, 0.6, MAT.wood, 0, 0.45, 0)) // Holzkorpus
    cabinet.add(box(0.85, 0.75, 0.6, MAT.cream, 0, 1.28, 0)) // Gehäuse oben
    cabinet.add(box(0.72, 0.62, 0.06, MAT.dark, 0, 1.32, 0.33)) // Bedienfeld
    cabinet.add(box(0.4, 0.32, 0.02, MAT.screen, -0.12, 1.42, 0.37)) // Screen
    cabinet.add(box(0.66, 0.07, 0.28, MAT.cream, 0, 0.94, 0.44)) // Tastaturablage
    cabinet.add(cylinder(0.045, 0.045, 0.03, MAT.red, -0.26, 1.12, 0.37)) // Not-Aus
    // Signalleuchte
    cabinet.add(cylinder(0.035, 0.035, 0.09, MAT.red, 0, 1.85, 0))
    cabinet.add(cylinder(0.035, 0.035, 0.09, MAT.yellow, 0, 1.76, 0))
    cabinet.add(cylinder(0.035, 0.035, 0.09, MAT.green, 0, 1.67, 0))
    cabinet.add(cylinder(0.012, 0.012, 0.12, MAT.metal, 0, 1.58, 0))
    g.add(cabinet)
    this.cabinet = cabinet

    return g
  }

  /** Schwebende orangene Gear-Sprites für den Startscreen. */
  buildGearField() {
    const group = new THREE.Group()
    const rng = (a, b) => a + Math.random() * (b - a)
    for (let i = 0; i < 14; i++) {
      const el = document.createElement('div')
      el.className = 'gear-float'
      const size = rng(50, 150)
      el.style.width = `${size}px`
      el.style.height = `${size}px`
      el.innerHTML = GEAR_SVG
      const sprite = new CSS3DSprite(el)
      sprite.scale.setScalar(1 / U)
      sprite.position.set(rng(-4.2, 4.2), rng(0.4, 3.4), rng(-1.5, 1.2))
      sprite.userData.base = sprite.position.clone()
      sprite.userData.phase = rng(0, Math.PI * 2)
      sprite.userData.speed = rng(0.3, 0.8)
      group.add(sprite)
      this.floatGears.push(sprite)
    }
    return group
  }

  /** Feuer-Sprites auf der Maschine (Konsequenz-Simulation). */
  igniteFire() {
    this.clearFire()
    const spots = [
      [0.55, 1.75, 0],
      [1.4, 1.25, -0.4],
      [0.9, 1.25, 0.55],
      [-0.78, 2.05, 0.55],
      [1.7, 1.35, 0.4],
    ]
    for (const [x, y, z] of spots) {
      const el = document.createElement('div')
      el.className = 'fire'
      el.innerHTML = '<span class="fire-inner">🔥</span>'
      const sprite = new CSS3DSprite(el)
      sprite.scale.setScalar(0.0035)
      sprite.position.set(x, y, z)
      this.machine.add(sprite)
      this.fires.push(sprite)
    }
  }

  clearFire() {
    for (const f of this.fires) f.removeFromParent()
    this.fires = []
  }

  /** 'live' | 'space' → volle Größe, 'mini' → Miniaturmodell vor dem User. */
  setMachineMode(mode) {
    this.machine.visible = true
    if (mode === 'mini') {
      this.machine.scale.setScalar(0.24 * U)
      this.machine.position.set(0, 0, 2.0 * U)
    } else {
      this.machine.scale.setScalar(U)
      this.machine.position.set(0, 0, 0)
    }
  }

  update(t) {
    for (const g of this.floatGears) {
      const { base, phase, speed } = g.userData
      g.position.y = base.y + Math.sin(t * speed + phase) * 0.14
      g.position.x = base.x + Math.cos(t * speed * 0.6 + phase) * 0.08
    }
  }
}
