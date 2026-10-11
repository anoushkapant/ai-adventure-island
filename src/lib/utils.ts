export function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function starsFor(accuracy: number): number {
  if (accuracy >= 90) return 3
  if (accuracy >= 70) return 2
  return 1
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
