export interface Item {
  id: string
  emoji: string
  name: string
  /** The "true" category used to grade the AI. */
  category: string
  /** Simple, kid-understandable traits the AI can look at. */
  features: string[]
}

export interface CategoryDef {
  id: string
  label: string
  emoji: string
  color: string
}

/* ------------------------------------------------------------------ */
/* Level 1 — Teach the Robot: Prutas (Fruit) vs Gulay (Veggie)         */
/* ------------------------------------------------------------------ */

export const level1Categories: CategoryDef[] = [
  { id: 'fruit', label: 'Prutas', emoji: '🍓', color: 'island-coral' },
  { id: 'vegetable', label: 'Gulay', emoji: '🥦', color: 'island-green' },
]

export const level1Items: Item[] = [
  { id: 'mango', emoji: '🥭', name: 'Manga', category: 'fruit', features: ['sweet', 'round', 'yellow', 'eaten_raw'] },
  { id: 'banana', emoji: '🍌', name: 'Saging', category: 'fruit', features: ['sweet', 'long', 'yellow', 'eaten_raw'] },
  { id: 'pineapple', emoji: '🍍', name: 'Pinya', category: 'fruit', features: ['sweet', 'small', 'yellow', 'eaten_raw'] },
  { id: 'buko', emoji: '🥥', name: 'Buko', category: 'fruit', features: ['sweet', 'round', 'hard', 'drink'] },
  { id: 'santol', emoji: '🍑', name: 'Santol', category: 'fruit', features: ['sweet', 'round', 'yellow', 'eaten_raw'] },
  { id: 'guyabano', emoji: '🍈', name: 'Guyabano', category: 'fruit', features: ['sweet', 'big', 'green', 'eaten_raw'] },
  { id: 'okra', emoji: '🥒', name: 'Okra', category: 'vegetable', features: ['crunchy', 'long', 'green', 'cooked'] },
  { id: 'ampalaya', emoji: '🥬', name: 'Ampalaya', category: 'vegetable', features: ['crunchy', 'long', 'green', 'bitter'] },
  { id: 'kalabasa', emoji: '🎃', name: 'Kalabasa', category: 'vegetable', features: ['crunchy', 'round', 'orange', 'cooked'] },
  { id: 'kamote', emoji: '🍠', name: 'Kamote', category: 'vegetable', features: ['soft', 'long', 'orange', 'cooked'] },
  { id: 'talong', emoji: '🍆', name: 'Talong', category: 'vegetable', features: ['crunchy', 'long', 'purple', 'cooked'] },
  { id: 'mais', emoji: '🌽', name: 'Mais', category: 'vegetable', features: ['crunchy', 'long', 'yellow', 'cooked'] },
]

/* ------------------------------------------------------------------ */
/* Level 2 — Robot Detective: Hayop / Sasakyan / Pagkain / Laruan      */
/* ------------------------------------------------------------------ */

export const level2Categories: CategoryDef[] = [
  { id: 'animal', label: 'Hayop', emoji: '🐾', color: 'island-green' },
  { id: 'vehicle', label: 'Sasakyan', emoji: '🚗', color: 'island-blue' },
  { id: 'food', label: 'Pagkain', emoji: '🍔', color: 'island-sun' },
  { id: 'toy', label: 'Laruan', emoji: '🧸', color: 'island-purple' },
]

export const level2Items: Item[] = [
  { id: 'kalabaw', emoji: '🐃', name: 'Kalabaw', category: 'animal', features: ['alive', 'has_legs', 'big', 'soft'] },
  { id: 'aso', emoji: '🐶', name: 'Aso', category: 'animal', features: ['alive', 'has_legs', 'soft', 'moves'] },
  { id: 'pusa', emoji: '🐱', name: 'Pusa', category: 'animal', features: ['alive', 'has_legs', 'soft', 'moves'] },
  { id: 'agila', emoji: '🦅', name: 'Agila', category: 'animal', features: ['alive', 'has_wings', 'soft', 'moves'] },
  { id: 'tilapia', emoji: '🐟', name: 'Tilapia', category: 'animal', features: ['alive', 'has_fins', 'soft', 'moves'] },
  { id: 'jeepney', emoji: '🚌', name: 'Jeepney', category: 'vehicle', features: ['has_wheels', 'metal', 'moves', 'big'] },
  { id: 'tricycle', emoji: '🛵', name: 'Tricycle', category: 'vehicle', features: ['has_wheels', 'metal', 'moves', 'small'] },
  { id: 'kotse', emoji: '🚗', name: 'Kotse', category: 'vehicle', features: ['has_wheels', 'metal', 'moves', 'big'] },
  { id: 'bangka', emoji: '🚤', name: 'Bangka', category: 'vehicle', features: ['moves', 'water', 'big', 'wood'] },
  { id: 'eroplano', emoji: '✈️', name: 'Eroplano', category: 'vehicle', features: ['has_wings', 'metal', 'moves', 'big'] },
  { id: 'halohalo', emoji: '🍧', name: 'Halo-halo', category: 'food', features: ['edible', 'sweet', 'cold', 'round'] },
  { id: 'adobo', emoji: '🍛', name: 'Adobo', category: 'food', features: ['edible', 'meaty', 'savory', 'cooked'] },
  { id: 'lumpia', emoji: '🥟', name: 'Lumpia', category: 'food', features: ['edible', 'crunchy', 'long', 'savory'] },
  { id: 'champorado', emoji: '🥣', name: 'Champorado', category: 'food', features: ['edible', 'sweet', 'hot', 'round'] },
  { id: 'sinigang', emoji: '🍲', name: 'Sinigang', category: 'food', features: ['edible', 'meaty', 'sour', 'cooked'] },
  { id: 'lechon', emoji: '🍗', name: 'Lechon', category: 'food', features: ['edible', 'meaty', 'crunchy', 'cooked'] },
  { id: 'yoyo', emoji: '🪀', name: 'Yo-Yo', category: 'toy', features: ['not_alive', 'round', 'play', 'small'] },
  { id: 'sipa', emoji: '⚽', name: 'Sipa', category: 'toy', features: ['not_alive', 'round', 'play', 'small'] },
  { id: 'legobricks', emoji: '🧱', name: 'Lego', category: 'toy', features: ['not_alive', 'hard', 'play', 'small'] },
  { id: 'robotlaruan', emoji: '🤖', name: 'Robot Talaga', category: 'toy', features: ['not_alive', 'metal', 'play', 'small'] },
]

/* ------------------------------------------------------------------ */
/* Level 3 — Spot the Bias: animals only, missing a whole group        */
/* ------------------------------------------------------------------ */

export const level3TrainedCategories: CategoryDef[] = [
  { id: 'cat', label: 'Pusa', emoji: '🐱', color: 'island-coral' },
  { id: 'dog', label: 'Aso', emoji: '🐶', color: 'island-blue' },
]

export const level3NewCategories: CategoryDef[] = [
  { id: 'rabbit', label: 'Kuneho', emoji: '🐰', color: 'island-purple' },
]

export const level3Items: Item[] = [
  { id: 'l3cat', emoji: '🐱', name: 'Pusa', category: 'cat', features: ['furry', 'whiskers', 'pointy_ears', 'tail'] },
  { id: 'l3dog', emoji: '🐶', name: 'Aso', category: 'dog', features: ['furry', 'floppy_ears', 'snout', 'tail'] },
  { id: 'l3rabbit', emoji: '🐰', name: 'Kuneho', category: 'rabbit', features: ['furry', 'long_ears', 'hopping', 'round_tail'] },
  { id: 'l3hamster', emoji: '🐹', name: 'Hamster', category: 'rabbit', features: ['furry', 'tiny_ears', 'storing_cheeks', 'round_tail'] },
]

/* ------------------------------------------------------------------ */
/* Train the Dragon — Bakunawa: Apoy (Fire) / Tubig (Water) /          */
/*                    Halaman (Plant) creatures                        */
/* ------------------------------------------------------------------ */

export const dragonCategories: CategoryDef[] = [
  { id: 'fire', label: 'Apoy', emoji: '🔥', color: 'island-coral' },
  { id: 'water', label: 'Tubig', emoji: '🌊', color: 'island-blue' },
  { id: 'plant', label: 'Halaman', emoji: '🌱', color: 'island-green' },
]

export const dragonItems: Item[] = [
  { id: 'alab', emoji: '🔥', name: 'Alab', category: 'fire', features: ['hot', 'glows', 'red', 'flies'] },
  { id: 'sulo', emoji: '🕯️', name: 'Sulo', category: 'fire', features: ['hot', 'glows', 'orange', 'ground'] },
  { id: 'kislap', emoji: '✨', name: 'Kislap', category: 'fire', features: ['hot', 'glows', 'yellow', 'flies'] },
  { id: 'alon', emoji: '🌊', name: 'Alon', category: 'water', features: ['wet', 'flows', 'blue', 'ground'] },
  { id: 'patak', emoji: '💧', name: 'Patak', category: 'water', features: ['wet', 'flows', 'blue', 'flies'] },
  { id: 'sirena', emoji: '🐠', name: 'Sirena', category: 'water', features: ['wet', 'swims', 'blue', 'ground'] },
  { id: 'sibol', emoji: '🌱', name: 'Sibol', category: 'plant', features: ['wet', 'grows', 'green', 'ground'] },
  { id: 'dahon', emoji: '🍃', name: 'Dahon', category: 'plant', features: ['dry', 'grows', 'green', 'flies'] },
  { id: 'kawayan', emoji: '🎋', name: 'Kawayan', category: 'plant', features: ['dry', 'grows', 'green', 'ground'] },
]

/* ------------------------------------------------------------------ */
/* Level 4 — Build Your Own AI Pet                                     */
/* ------------------------------------------------------------------ */

export const petBodies: { id: string; label: string; emoji: string }[] = [
  { id: 'panda', label: 'Panda Bot', emoji: '🐼' },
  { id: 'fox', label: 'Fox Bot', emoji: '🦊' },
  { id: 'unicorn', label: 'Unicorn Bot', emoji: '🦄' },
  { id: 'penguin', label: 'Penguin Bot', emoji: '🐧' },
  { id: 'frog', label: 'Frog Bot', emoji: '🐸' },
]

export const petColors: { id: string; label: string; hex: string }[] = [
  { id: 'blue', label: 'Blue', hex: '#4CC9F0' },
  { id: 'yellow', label: 'Yellow', hex: '#FFD60A' },
  { id: 'purple', label: 'Purple', hex: '#9B5DE5' },
  { id: 'green', label: 'Green', hex: '#00C853' },
  { id: 'coral', label: 'Coral', hex: '#FF6B6B' },
]

export const petAbilities: { id: string; label: string; emoji: string; requiredAccuracy: number }[] = [
  { id: 'speak', label: 'Speaks!', emoji: '🗣️', requiredAccuracy: 30 },
  { id: 'dance', label: 'Dances!', emoji: '💃', requiredAccuracy: 50 },
  { id: 'sparkle', label: 'Sparkle Power!', emoji: '✨', requiredAccuracy: 70 },
  { id: 'rocket', label: 'Rocket Feet!', emoji: '🚀', requiredAccuracy: 90 },
]

export const allItems = [...level1Items, ...level2Items, ...level3Items, ...dragonItems]

export const itemById = (id: string): Item | undefined => allItems.find((i) => i.id === id)
