let speechEnabled = true

export function setSpeechEnabled(value: boolean) {
  speechEnabled = value
  if (!value && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

export function speak(text: string) {
  if (!speechEnabled) return
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 0.95
    utter.pitch = 1.2
    utter.volume = 1
    const voices = window.speechSynthesis.getVoices()
    const friendly = voices.find((v) => /female|samantha|karen|zira|google uk english female/i.test(v.name))
    if (friendly) utter.voice = friendly
    window.speechSynthesis.speak(utter)
  } catch {
    /* speech is a bonus, never break the game */
  }
}

let audioCtx: AudioContext | null = null

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!audioCtx) audioCtx = new Ctor()
  return audioCtx
}

type Note = { f: number; t: number; d: number }

const CHIMES: Record<string, Note[]> = {
  correct: [
    { f: 523.25, t: 0, d: 0.12 },
    { f: 783.99, t: 0.1, d: 0.14 },
  ],
  wrong: [
    { f: 329.63, t: 0, d: 0.16 },
    { f: 246.94, t: 0.12, d: 0.2 },
  ],
  reward: [
    { f: 523.25, t: 0, d: 0.12 },
    { f: 659.25, t: 0.1, d: 0.12 },
    { f: 783.99, t: 0.2, d: 0.12 },
    { f: 1046.5, t: 0.3, d: 0.2 },
  ],
  click: [{ f: 660, t: 0, d: 0.06 }],
}

export function playSound(name: keyof typeof CHIMES, enabled = true) {
  if (!enabled) return
  const c = ctx()
  if (!c) return
  if (c.state === 'suspended') void c.resume()
  for (const note of CHIMES[name]) {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'sine'
    osc.frequency.value = note.f
    const start = c.currentTime + note.t
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + note.d)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(start)
    osc.stop(start + note.d + 0.05)
  }
}
