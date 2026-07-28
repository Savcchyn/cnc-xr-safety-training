// Synthetisierte Sounds per Web Audio — keine Assets nötig.
let ctx = null

function getCtx() {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

let noiseBuffer = null

function getNoiseBuffer(c) {
  if (noiseBuffer) return noiseBuffer
  const len = Math.floor(c.sampleRate * 0.2)
  noiseBuffer = c.createBuffer(1, len, c.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  return noiseBuffer
}

export function playNotifSound() {
  try {
    const ctx = getCtx()
    const t = ctx.currentTime
    const blip = (freq, start, dur, peak = 0.16) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, t + start)
      gain.gain.linearRampToValueAtTime(peak, t + start + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.001, t + start + dur)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t + start)
      osc.stop(t + start + dur + 0.05)
    }
    blip(740, 0, 0.2)
    blip(1108.7, 0.09, 0.26)
  } catch {
    // Audio nicht verfügbar — Notification erscheint trotzdem
  }
}

/** Holz-Knacksen: tiefer Schlag + drei kurze Knack-Bursts aus gefiltertem Rauschen. */
export function playWoodCrack() {
  try {
    const c = getCtx()
    const t = c.currentTime

    // Tieffrequenter Schlag
    const osc = c.createOscillator()
    const og = c.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(120, t)
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.22)
    og.gain.setValueAtTime(0.35, t)
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
    osc.connect(og).connect(c.destination)
    osc.start(t)
    osc.stop(t + 0.35)

    // Knack-Bursts
    const bursts = [
      [0, 2600, 0.5],
      [0.07, 1900, 0.38],
      [0.16, 3200, 0.28],
    ]
    for (const [delay, freq, peak] of bursts) {
      const src = c.createBufferSource()
      src.buffer = getNoiseBuffer(c)
      const bp = c.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = freq
      bp.Q.value = 1.2
      const g = c.createGain()
      g.gain.setValueAtTime(peak, t + delay)
      g.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.09)
      src.connect(bp).connect(g).connect(c.destination)
      src.start(t + delay)
      src.stop(t + delay + 0.12)
    }
  } catch {
    // Audio nicht verfügbar — Splitter fliegen trotzdem
  }
}
