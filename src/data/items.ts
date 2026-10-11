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
/* Level 1 — Teach the Robot: Fruit vs Vegetable                       */
/* ------------------------------------------------------------------ */

export const level1Categories: CategoryDef[] = [
  { id: 'fruit', label: 'Fruit', emoji: '🍓', color: 'island-coral' },
  { id: 'vegetable', label: 'Veggie', emoji: '🥦', color: 'island-green' },
]

export const level1Items: Item[] = [
  { id: 'apple', emoji: '🍎', name: 'Apple', category: 'fruit', features: ['sweet', 'round', 'red', 'eaten_raw'] },
  { id: 'banana', emoji: '🍌', name: 'Banana', category: 'fruit', features: ['sweet', 'long', 'yellow', 'eaten_raw'] },
  { id: 'strawberry', emoji: '🍓', name: 'Strawberry', category: 'fruit', features: ['sweet', 'small', 'red', 'eaten_raw'] },
  { id: 'grapes', emoji: '🍇', name: 'Grapes', category: 'fruit', features: ['sweet', 'small', 'purple', 'eaten_raw'] },
  { id: 'orange', emoji: '🍊', name: 'Orange', category: 'fruit', features: ['sweet', 'round', 'orange', 'eaten_raw'] },
  { id: 'watermelon', emoji: '🍉', name: 'Watermelon', category: 'fruit', features: ['sweet', 'big', 'green', 'eaten_raw'] },
  { id: 'carrot', emoji: '🥕', name: 'Carrot', category: 'vegetable', features: ['crunchy', 'long', 'orange', 'cooked'] },
  { id: 'broccoli', emoji: '🥦', name: 'Broccoli', category: 'vegetable', features: ['crunchy', 'round', 'green', 'cooked'] },
  { id: 'corn', emoji: '🌽', name: 'Corn', category: 'vegetable', features: ['crunchy', 'long', 'yellow', 'cooked'] },
  { id: 'tomato', emoji: '🍅', name: 'Tomato', category: 'vegetable', features: ['crunchy', 'round', 'red', 'cooked'] },
  { id: 'pepper', emoji: '🫑', name: 'Pepper', category: 'vegetable', features: ['crunchy', 'round', 'green', 'cooked'] },
  { id: 'eggplant', emoji: '🍆', name: 'Eggplant', category: 'vegetable', features: ['crunchy', 'long', 'purple', 'cooked'] },
]

/* ------------------------------------------------------------------ */
/* Level 2 — Robot Detective: Animal / Vehicle / Food / Toy            */
/* ------------------------------------------------------------------ */

export const level2Categories: CategoryDef[] = [
  { id: 'animal', label: 'Animal', emoji: '🐾', color: 'island-green' },
  { id: 'vehicle', label: 'Vehicle', emoji: '🚗', color: 'island-blue' },
  { id: 'food', label: 'Food', emoji: '🍔', color: 'island-sun' },
  { id: 'toy', label: 'Toy', emoji: '🧸', color: 'island-purple' },
]

export const level2Items: Item[] = [
  { id: 'cat', emoji: '🐱', name: 'Cat', category: 'animal', features: ['alive', 'has_legs', 'soft', 'moves'] },
  { id: 'dog', emoji: '🐶', name: 'Dog', category: 'animal', features: ['alive', 'has_legs', 'soft', 'moves'] },
  { id: 'bird', emoji: '🐦', name: 'Bird', category: 'animal', features: ['alive', 'has_wings', 'soft', 'moves'] },
  { id: 'fish', emoji: '🐟', name: 'Fish', category: 'animal', features: ['alive', 'has_fins', 'soft', 'moves'] },
  { id: 'car', emoji: '🚗', name: 'Car', category: 'vehicle', features: ['has_wheels', 'metal', 'moves', 'big'] },
  { id: 'bus', emoji: '🚌', name: 'Bus', category: 'vehicle', features: ['has_wheels', 'metal', 'moves', 'big'] },
  { id: 'bike', emoji: '🚲', name: 'Bike', category: 'vehicle', features: ['has_wheels', 'metal', 'moves', 'small'] },
  { id: 'plane', emoji: '✈️', name: 'Plane', category: 'vehicle', features: ['has_wings', 'metal', 'moves', 'big'] },
  { id: 'pizza', emoji: '🍕', name: 'Pizza', category: 'food', features: ['edible', 'round', 'cooked', 'tasty'] },
  { id: 'burger', emoji: '🍔', name: 'Burger', category: 'food', features: ['edible', 'round', 'cooked', 'tasty'] },
  { id: 'icecream', emoji: '🍦', name: 'Ice Cream', category: 'food', features: ['edible', 'soft', 'sweet', 'tasty'] },
  { id: 'cake', emoji: '🎂', name: 'Cake', category: 'food', features: ['edible', 'soft', 'sweet', 'tasty'] },
  { id: 'teddy', emoji: '🧸', name: 'Teddy', category: 'toy', features: ['not_alive', 'soft', 'play', 'small'] },
  { id: 'ball', emoji: '⚽', name: 'Ball', category: 'toy', features: ['not_alive', 'round', 'play', 'small'] },
  { id: 'blocks', emoji: '🧱', name: 'Blocks', category: 'toy', features: ['not_alive', 'hard', 'play', 'small'] },
  { id: 'robot', emoji: '🤖', name: 'Robot Toy', category: 'toy', features: ['not_alive', 'metal', 'play', 'small'] },
]

/* ------------------------------------------------------------------ */
/* Level 3 — Spot the Bias: animals only, missing a whole group        */
/* ------------------------------------------------------------------ */

export const level3TrainedCategories: CategoryDef[] = [
  { id: 'cat', label: 'Cat', emoji: '🐱', color: 'island-coral' },
  { id: 'dog', label: 'Dog', emoji: '🐶', color: 'island-blue' },
]

export const level3NewCategories: CategoryDef[] = [
  { id: 'rabbit', label: 'Rabbit', emoji: '🐰', color: 'island-purple' },
]

export const level3Items: Item[] = [
  { id: 'l3cat', emoji: '🐱', name: 'Cat', category: 'cat', features: ['furry', 'whiskers', 'pointy_ears', 'tail'] },
  { id: 'l3dog', emoji: '🐶', name: 'Dog', category: 'dog', features: ['furry', 'floppy_ears', 'snout', 'tail'] },
  { id: 'l3rabbit', emoji: '🐰', name: 'Rabbit', category: 'rabbit', features: ['furry', 'long_ears', 'hopping', 'round_tail'] },
  { id: 'l3hamster', emoji: '🐹', name: 'Hamster', category: 'rabbit', features: ['furry', 'tiny_ears', 'storing_cheeks', 'round_tail'] },
]

/* ------------------------------------------------------------------ */
/* Dragon — Fire / Water / Plant creatures                             */
/* ------------------------------------------------------------------ */

export const dragonCategories: CategoryDef[] = [
  { id: 'fire', label: 'Fire', emoji: '🔥', color: 'island-coral' },
  { id: 'water', label: 'Water', emoji: '🌊', color: 'island-blue' },
  { id: 'plant', label: 'Plant', emoji: '🌱', color: 'island-green' },
]

export const dragonItems: Item[] = [
  { id: 'phoenix', emoji: '🔥', name: 'Ember', category: 'fire', features: ['hot', 'glows', 'red', 'flies'] },
  { id: 'lava', emoji: '🌋', name: 'Lava Blob', category: 'fire', features: ['hot', 'glows', 'red', 'ground'] },
  { id: 'torch', emoji: '🕯️', name: 'Torch Spirit', category: 'fire', features: ['hot', 'glows', 'orange', 'ground'] },
  { id: 'wave', emoji: '🌊', name: 'Wave', category: 'water', features: ['wet', 'flows', 'blue', 'ground'] },
  { id: 'drop', emoji: '💧', name: 'Dew Drop', category: 'water', features: ['wet', 'flows', 'blue', 'flies'] },
  { id: 'splash', emoji: '🐳', name: 'Splasher', category: 'water', features: ['wet', 'swims', 'blue', 'ground'] },
  { id: 'sprout', emoji: '🌱', name: 'Sprout', category: 'plant', features: ['wet', 'grows', 'green', 'ground'] },
  { id: 'leaf', emoji: '🍃', name: 'Leafy', category: 'plant', features: ['dry', 'grows', 'green', 'flies'] },
  { id: 'cactus', emoji: '🌵', name: 'Spikey', category: 'plant', features: ['dry', 'grows', 'green', 'ground'] },
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
