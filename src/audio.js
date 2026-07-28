// Kleiner UI-Sound (zwei weiche Sinus-Blips) für Push-Notifications —
// synthetisiert per Web Audio, keine Assets nötig.
let ctx = null

export function playNotifSound() {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
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
