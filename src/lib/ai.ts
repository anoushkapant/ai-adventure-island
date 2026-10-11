import type { CategoryDef, Item } from '../data/items'

export interface TrainingExample {
  item: Item
  label: string
}

export interface Prediction {
  /** Category the AI chose. */
  label: string
  /** 0..1 — how sure the AI feels, based on how much data it has seen. */
  confidence: number
  /** Raw scores per category (handy for "thinking" bars). */
  scores: Record<string, number>
}

/**
 * A tiny, fully client-side, rule-based "AI".
 *
 * It does not do real machine learning — it imitates learning in a way
 * children can understand:
 *   • It remembers which traits appeared in each category.
 *   • The more examples it sees, the more confident it gets.
 *   • When it has seen very few examples it falls back to guessing the
 *     category it has seen the most (the "majority class"), which is
 *     exactly how real biased models behave.
 */
export class RobotBrain {
  examples: TrainingExample[] = []
  categories: CategoryDef[]

  constructor(categories: CategoryDef[]) {
    this.categories = categories
  }

  reset() {
    this.examples = []
  }

  train(item: Item, label: string) {
    this.examples.push({ item, label })
  }

  countFor(label: string): number {
    return this.examples.filter((e) => e.label === label).length
  }

  get total(): number {
    return this.examples.length
  }

  /** Traits the AI has associated with each category so far. */
  private featurePools(): Record<string, Set<string>> {
    const pools: Record<string, Set<string>> = {}
    for (const cat of this.categories) pools[cat.id] = new Set()
    for (const ex of this.examples) {
      if (!pools[ex.label]) pools[ex.label] = new Set()
      for (const f of ex.item.features) pools[ex.label].add(f)
    }
    return pools
  }

  predict(item: Item, rng: () => number = Math.random): Prediction {
    const C = this.categories.length
    const total = this.total
    const pools = this.featurePools()
    const scores: Record<string, number> = {}

    for (const cat of this.categories) {
      const pool = pools[cat.id] ?? new Set<string>()
      const matched = item.features.filter((f) => pool.has(f)).length
      const overlap = item.features.length ? matched / item.features.length : 0
      const count = this.countFor(cat.id)
      const dataFactor = count / (count + 2)
      const prior = (count + 0.5) / (total + 0.5 * C)
      scores[cat.id] = 0.6 * overlap + 0.7 * dataFactor + 0.7 * prior
    }

    // Pick the highest score; break ties randomly for a lively feel.
    let best = this.categories[0].id
    let bestScore = -Infinity
    for (const cat of this.categories) {
      const s = scores[cat.id] + rng() * 1e-3
      if (s > bestScore) {
        bestScore = s
        best = cat.id
      }
    }

    const count = this.countFor(best)
    const confidence = Math.min(1, count / 5)
    return { label: best, confidence, scores }
  }

  /** How well the AI does on a set of test items (0..100). */
  accuracyOn(testItems: Item[], rng: () => number = Math.random): number {
    if (testItems.length === 0) return 0
    if (this.total === 0) return 0
    let correct = 0
    for (const item of testItems) {
      if (this.predict(item, rng).label === item.category) correct++
    }
    return Math.round((correct / testItems.length) * 100)
  }

  /** Deterministic accuracy (no tie randomness) for progress display. */
  stableAccuracyOn(testItems: Item[]): number {
    return this.accuracyOn(testItems, () => 0.5)
  }
}

export interface AccuracyBand {
  emoji: string
  label: string
  color: string
}

export function accuracyBand(accuracy: number): AccuracyBand {
  if (accuracy <= 30) return { emoji: '🌱', label: 'Natututo', color: '#08ab4e' }
  if (accuracy <= 60) return { emoji: '😊', label: 'Bumubuti', color: '#f5b338' }
  if (accuracy <= 90) return { emoji: '🚀', label: 'Matalino', color: '#2d6cdf' }
  return { emoji: '🏆', label: 'AI Master', color: '#a220df' }
}
