import * as THREE from 'three'
import { U } from './units.js'

/**
 * First-Person-Steuerung: Maus ziehen = umschauen, WASD = bewegen,
 * Scrollen = zoomen (Dolly). Sanfte Kamerafahrten zwischen den Szenen.
 */
export class FPControls {
  constructor(camera, domElement) {
    this.camera = camera
    this.dom = domElement
    this.enabled = true
    this.lookEnabled = true
    this.wheelEnabled = true

    this.yaw = 0
    this.pitch = 0
    this.position = camera.position.clone()

    this.keys = new Set()
    this.dragging = false
    this.dragMoved = 0
    this.last = { x: 0, y: 0 }
    this.tween = null

    window.addEventListener('pointerdown', (e) => this.onPointerDown(e))
    window.addEventListener('pointermove', (e) => this.onPointerMove(e))
    window.addEventListener('pointerup', () => (this.dragging = false))
    window.addEventListener('keydown', (e) => this.onKey(e, true))
    window.addEventListener('keyup', (e) => this.onKey(e, false))
    window.addEventListener('wheel', (e) => this.onWheel(e), { passive: false })
  }

  onPointerDown(e) {
    if (!this.enabled || !this.lookEnabled) return
    // Nur auf dem Canvas (nicht auf UI-Panels) mit dem Umschauen beginnen
    if (e.target.closest('.panel') || e.target.closest('.gear-hotspot')) return
    this.dragging = true
    this.dragMoved = 0
    this.last = { x: e.clientX, y: e.clientY }
  }

  onPointerMove(e) {
    if (!this.dragging) return
    const dx = e.clientX - this.last.x
    const dy = e.clientY - this.last.y
    this.dragMoved += Math.abs(dx) + Math.abs(dy)
    this.last = { x: e.clientX, y: e.clientY }
    this.tween = null
    this.yaw -= dx * 0.0035
    this.pitch -= dy * 0.0035
    this.pitch = THREE.MathUtils.clamp(this.pitch, -1.1, 1.1)
  }

  onKey(e, down) {
    const k = e.key.toLowerCase()
    if (['w', 'a', 's', 'd'].includes(k)) {
      if (down) {
        this.keys.add(k)
        this.tween = null
      } else {
        this.keys.delete(k)
      }
    }
  }

  onWheel(e) {
    if (!this.enabled || !this.wheelEnabled) return
    if (e.target.closest('.panel')) return
    e.preventDefault()
    this.tween = null
    const dir = new THREE.Vector3(0, 0, -1).applyEuler(
      new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ')
    )
    this.position.addScaledVector(dir, -e.deltaY * 0.0035 * U)
    this.clampPosition()
  }

  clampPosition() {
    this.position.x = THREE.MathUtils.clamp(this.position.x, -8 * U, 8 * U)
    this.position.z = THREE.MathUtils.clamp(this.position.z, -3 * U, 8 * U)
    this.position.y = THREE.MathUtils.clamp(this.position.y, 0.6 * U, 3.2 * U)
  }

  /** Sanfte Fahrt zu einer Pose: { pos: Vector3, look: Vector3 } */
  goTo(pos, look, duration = 1.1) {
    const dir = new THREE.Vector3().subVectors(look, pos).normalize()
    const targetPitch = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1))
    const targetYaw = Math.atan2(-dir.x, -dir.z)

    // Yaw auf kürzestem Weg
    let fromYaw = this.yaw % (Math.PI * 2)
    let dYaw = targetYaw - fromYaw
    if (dYaw > Math.PI) dYaw -= Math.PI * 2
    if (dYaw < -Math.PI) dYaw += Math.PI * 2

    this.tween = {
      t: 0,
      duration,
      fromPos: this.position.clone(),
      toPos: pos.clone(),
      fromYaw,
      dYaw,
      fromPitch: this.pitch,
      dPitch: targetPitch - this.pitch,
    }
  }

  update(dt) {
    if (this.tween) {
      const tw = this.tween
      tw.t += dt / tw.duration
      const k = tw.t >= 1 ? 1 : 1 - Math.pow(1 - tw.t, 3) // easeOutCubic
      this.position.lerpVectors(tw.fromPos, tw.toPos, k)
      this.yaw = tw.fromYaw + tw.dYaw * k
      this.pitch = tw.fromPitch + tw.dPitch * k
      if (tw.t >= 1) this.tween = null
    }

    if (this.keys.size) {
      const speed = 2.4 * U * dt
      const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw))
      const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw))
      if (this.keys.has('w')) this.position.addScaledVector(forward, speed)
      if (this.keys.has('s')) this.position.addScaledVector(forward, -speed)
      if (this.keys.has('a')) this.position.addScaledVector(right, -speed)
      if (this.keys.has('d')) this.position.addScaledVector(right, speed)
      this.clampPosition()
    }

    this.camera.position.copy(this.position)
    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ')
  }
}
