// Kompakter Three.js-Viewer für die AR-Simulation der App:
// Maschinen-Modelle (wie im XR-Prototyp), Tap-to-Place, Turntable-Gesten,
// Hotspot-Projektion und die drei Konsequenz-Effekte.
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

const EFFECTS = {
  m1: {
    fireSpots: [
      [0.55, 1.75, 0],
      [1.4, 1.25, -0.4],
      [0.9, 1.25, 0.55],
      [-0.78, 2.05, 0.55],
    ],
    splinter: { x: [0.1, 1.1], y: [1.12, 1.25], z: [-0.35, 0.35], style: 'wood' },
  },
  m2: {
    fireSpots: [
      [0, 1.9, 0],
      [-0.5, 1.2, 0.4],
      [0.55, 1.3, 0.3],
    ],
    splinter: { x: [-0.45, 0.45], y: [1.0, 1.15], z: [-0.25, 0.35], style: 'metal' },
  },
  m3: {
    fireSpots: [
      [-0.5, 1.45, 0.15],
      [0.3, 1.35, 0.4],
      [1.0, 1.15, 0.4],
    ],
    splinter: { x: [-0.9, -0.2], y: [0.8, 1.0], z: [0.1, 0.4], style: 'metal' },
  },
}

function emojiTexture(emoji, size = 128) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  ctx.font = `${size * 0.82}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, size / 2, size / 2)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export class ArScene {
  constructor(canvas) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.05, 60)

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x555a66, 1.25))
    const dir = new THREE.DirectionalLight(0xffffff, 1.5)
    dir.position.set(3, 6, 4)
    this.scene.add(dir)

    // Boden-Schatten-Andeutung
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(2.4, 40),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.32 })
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.scale.y = 0.72
    this.shadow = shadow

    this.machine = new THREE.Group()
    this.machine.visible = false
    this.machine.add(shadow)
    this.scene.add(this.machine)

    this.variant = 'm1'
    this.placed = false
    this.orbit = { yaw: 0.5, pitch: 0.3, dist: 6.2 }
    this.fires = []
    this.splinters = []
    this.waterGroup = null
    this.splinterGroup = null
    this.popScale = 0

    this.clock = new THREE.Clock()
    this.onFrame = null
    this.setupGestures()
    this.resize()
    window.addEventListener('resize', () => this.resize())
    this.renderer.setAnimationLoop(() => this.tick())
  }

  resize() {
    const { clientWidth: w, clientHeight: h } = this.canvas.parentElement
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  /* ---------------- Maschine laden ---------------- */

  async loadMachine(variant) {
    this.variant = variant
    if (this.model) {
      this.model.removeFromParent()
      this.model = null
    }

    const base = `${import.meta.env.BASE_URL}models/`
    const gltf = (f) =>
      new Promise((res, rej) => new GLTFLoader().load(base + f, (g) => res(g.scene), undefined, rej))

    const wrap = (obj, footprint) => {
      const box = new THREE.Box3().setFromObject(obj)
      const size = box.getSize(new THREE.Vector3())
      obj.scale.setScalar(footprint / Math.max(size.x, size.z))
      const sb = new THREE.Box3().setFromObject(obj)
      const c = sb.getCenter(new THREE.Vector3())
      const g = new THREE.Group()
      g.add(obj)
      obj.position.set(-c.x, -sb.min.y, -c.z)
      return g
    }

    let model
    if (variant === 'm2') {
      model = wrap(await gltf('cnc-milling-001.glb'), 2.2)
    } else if (variant === 'm3') {
      const obj = await new Promise((res, rej) =>
        new OBJLoader().load(base + 'lathe/cnc-lathe.obj', res, undefined, rej)
      )
      const texLoader = new THREE.TextureLoader()
      const tex = (f, srgb = false) => {
        const t = texLoader.load(`${base}lathe/textures/${f}`)
        if (srgb) t.colorSpace = THREE.SRGBColorSpace
        return t
      }
      const makeMat = (prefix, extra = {}) =>
        new THREE.MeshStandardMaterial({
          map: tex(`${prefix}_diffuse.png`, true),
          emissiveMap: tex(`${prefix}_illum.png`, true),
          emissive: 0xffffff,
          emissiveIntensity: 0.75,
          roughness: 0.5,
          ...extra,
        })
      const MATS = {
        front: makeMat('Modern_Lathe_front'),
        body: makeMat('Modern_Lathe_body', {
          alphaMap: tex('Modern_Lathe_body_opacity.png'),
          alphaTest: 0.4,
        }),
        control: makeMat('main_control'),
      }
      obj.traverse((o) => {
        if (!o.isMesh) return
        const n = o.name.toLowerCase()
        o.material = n.startsWith('main_control') ? MATS.control : n.includes('body') ? MATS.body : MATS.front
      })
      obj.rotation.x = -Math.PI / 2
      model = wrap(obj, 3.0)
    } else {
      const router = wrap(await gltf('cnc-wooden-001.glb'), 3.2)
      router.children[0].position.x += 0.4
      try {
        const panel = await gltf('cnc-control-panel.glb')
        const pw = new THREE.Group()
        pw.add(panel)
        panel.rotation.x = Math.PI / 2
        let box = new THREE.Box3().setFromObject(pw)
        panel.scale.setScalar(0.56 / box.getSize(new THREE.Vector3()).x)
        box = new THREE.Box3().setFromObject(pw)
        const c = box.getCenter(new THREE.Vector3())
        pw.position.set(-0.755 - c.x, 1.31 - c.y, 1.2 - box.min.z)
        router.add(pw)
      } catch (e) {
        console.error('[ar] Bedienpult fehlt', e)
      }
      model = router
    }

    this.model = model
    this.machine.add(model)
    return model
  }

  /* ---------------- Platzierung & Gesten ---------------- */

  place() {
    this.placed = true
    this.machine.visible = true
    this.popScale = 0.001
  }

  reset() {
    this.orbit = { yaw: 0.5, pitch: 0.3, dist: 6.2 }
  }

  setupGestures() {
    const el = this.canvas
    let pointers = new Map()
    let lastDist = 0

    el.addEventListener('pointerdown', (e) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      el.setPointerCapture(e.pointerId)
    })
    el.addEventListener('pointermove', (e) => {
      if (!pointers.has(e.pointerId)) return
      const prev = pointers.get(e.pointerId)
      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

      if (pointers.size === 1) {
        this.orbit.yaw -= dx * 0.008
        this.orbit.pitch = THREE.MathUtils.clamp(this.orbit.pitch + dy * 0.004, 0.05, 1.1)
      } else if (pointers.size === 2) {
        const pts = [...pointers.values()]
        const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
        if (lastDist) {
          this.orbit.dist = THREE.MathUtils.clamp(this.orbit.dist * (lastDist / d), 2.2, 8.5)
        }
        lastDist = d
      }
    })
    const up = (e) => {
      pointers.delete(e.pointerId)
      if (pointers.size < 2) lastDist = 0
    }
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault()
        this.orbit.dist = THREE.MathUtils.clamp(this.orbit.dist + e.deltaY * 0.004, 2.2, 8.5)
      },
      { passive: false }
    )
    let lastTap = 0
    el.addEventListener('pointerdown', () => {
      const now = performance.now()
      if (now - lastTap < 320) this.reset()
      lastTap = now
    })
  }

  /* ---------------- Konsequenz-Effekte ---------------- */

  get effects() {
    return EFFECTS[this.variant] || EFFECTS.m1
  }

  showConsequence(type) {
    this.clearConsequence()
    if (type === 'water') this.spawnWater()
    else if (type === 'wood') this.spawnSplinters()
    else this.spawnFire()
  }

  clearConsequence() {
    for (const f of this.fires) f.removeFromParent()
    this.fires = []
    if (this.waterGroup) this.waterGroup.removeFromParent()
    this.waterGroup = null
    if (this.splinterGroup) this.splinterGroup.removeFromParent()
    this.splinterGroup = null
    this.splinters = []
  }

  spawnFire() {
    const tex = emojiTexture('🔥')
    for (const [x, y, z] of this.effects.fireSpots) {
      const s = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false })
      )
      s.scale.setScalar(0.55)
      s.position.set(x, y + 0.18, z)
      s.userData.phase = Math.random() * Math.PI * 2
      this.machine.add(s)
      this.fires.push(s)
    }
  }

  spawnWater() {
    const g = new THREE.Group()
    const mat = new THREE.MeshStandardMaterial({
      color: 0x4d84a8,
      transparent: true,
      opacity: 0.72,
      roughness: 0.08,
      metalness: 0.35,
    })
    const blobs = [
      [0.5, 0.3, 2.2, 1.5, 0],
      [-1.3, 1.0, 1.4, 1.0, 0.4],
      [1.7, 0.9, 1.1, 0.8, -0.3],
    ]
    for (const [x, z, rx, rz, rot] of blobs) {
      const m = new THREE.Mesh(new THREE.CircleGeometry(1, 36), mat)
      m.rotation.x = -Math.PI / 2
      m.rotation.z = rot
      m.scale.set(rx, rz, 1)
      m.position.set(x, 0.015, z)
      g.add(m)
    }
    this.machine.add(g)
    this.waterGroup = g
  }

  spawnSplinters() {
    const cfg = this.effects.splinter
    const metal = cfg.style === 'metal'
    const mats = metal
      ? [
          new THREE.MeshStandardMaterial({ color: 0xc2c7cd, roughness: 0.25, metalness: 0.9 }),
          new THREE.MeshStandardMaterial({ color: 0x8e939a, roughness: 0.3, metalness: 0.85 }),
        ]
      : [
          new THREE.MeshStandardMaterial({ color: 0xc9a06a, roughness: 0.8 }),
          new THREE.MeshStandardMaterial({ color: 0xdec49e, roughness: 0.85 }),
        ]
    const rng = (a, b) => a + Math.random() * (b - a)
    const g = new THREE.Group()
    this.splinters = []
    for (let i = 0; i < 24; i++) {
      const geo = metal
        ? new THREE.BoxGeometry(rng(0.05, 0.16), 0.008, rng(0.01, 0.03))
        : new THREE.BoxGeometry(rng(0.05, 0.2), 0.016, rng(0.02, 0.06))
      const mesh = new THREE.Mesh(geo, mats[i % mats.length])
      mesh.position.set(rng(...cfg.x), rng(...cfg.y), rng(...cfg.z))
      mesh.rotation.set(rng(0, 3), rng(0, 3), rng(0, 3))
      g.add(mesh)
      this.splinters.push({
        mesh,
        vel: new THREE.Vector3(rng(-1.8, 1.8), rng(1.5, 3.4), rng(-1.8, 2.0)),
        ang: new THREE.Vector3(rng(-8, 8), rng(-8, 8), rng(-8, 8)),
        resting: false,
      })
    }
    this.machine.add(g)
    this.splinterGroup = g
  }

  /* ---------------- Projektion & Loop ---------------- */

  project(local) {
    const v = new THREE.Vector3(...local).applyMatrix4(this.machine.matrixWorld)
    v.project(this.camera)
    const el = this.canvas.parentElement
    return {
      x: ((v.x + 1) / 2) * el.clientWidth,
      y: ((-v.y + 1) / 2) * el.clientHeight,
      visible: v.z < 1,
    }
  }

  tick() {
    const dt = Math.min(this.clock.getDelta(), 0.05)
    const t = this.clock.elapsedTime

    // Pop-in nach dem Platzieren
    if (this.placed && this.popScale < 1) {
      this.popScale = Math.min(1, this.popScale + dt * 2.6)
      const s = 1 - Math.pow(1 - this.popScale, 3)
      this.machine.scale.setScalar(s)
    }

    // Orbit-Kamera um das Modell
    const { yaw, pitch, dist } = this.orbit
    const target = new THREE.Vector3(0, 0.95, 0)
    this.camera.position.set(
      target.x + dist * Math.cos(pitch) * Math.sin(yaw),
      target.y + dist * Math.sin(pitch),
      target.z + dist * Math.cos(pitch) * Math.cos(yaw)
    )
    this.camera.lookAt(target)

    // Feuer flackern
    for (const f of this.fires) {
      const k = 0.5 + 0.14 * Math.sin(t * 9 + f.userData.phase)
      f.scale.setScalar(k)
    }

    // Splitter-Physik
    for (const s of this.splinters) {
      if (s.resting) continue
      s.vel.y -= 9.8 * dt
      s.mesh.position.addScaledVector(s.vel, dt)
      s.mesh.rotation.x += s.ang.x * dt
      s.mesh.rotation.y += s.ang.y * dt
      s.mesh.rotation.z += s.ang.z * dt
      if (s.mesh.position.y <= 0.02) {
        s.mesh.position.y = 0.02
        s.resting = true
      }
    }

    this.renderer.render(this.scene, this.camera)
    this.onFrame?.()
  }
}
