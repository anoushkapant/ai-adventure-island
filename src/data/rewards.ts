export interface Sticker {
  id: string
  emoji: string
  name: string
  hint: string
}

export interface Decoration {
  id: string
  emoji: string
  name: string
}

export const STICKERS: Sticker[] = [
  { id: 'first_train', emoji: '🎓', name: 'First Teacher', hint: 'Train the robot with your first example' },
  { id: 'ten_examples', emoji: '📚', name: 'Data Collector', hint: 'Give the robot 10 examples' },
  { id: 'l1_done', emoji: '🍓', name: 'Fruit Sorter', hint: 'Finish Teach the Robot' },
  { id: 'detective', emoji: '🕵️', name: 'Robot Detective', hint: 'Finish Robot Detective' },
  { id: 'bias_buster', emoji: '⚖️', name: 'Bias Buster', hint: 'Discover and fix unfair data' },
  { id: 'pet_maker', emoji: '🐾', name: 'Pet Creator', hint: 'Build your own AI pet' },
  { id: 'dragon_friend', emoji: '🐲', name: 'Dragon Friend', hint: 'Help the baby dragon grow' },
  { id: 'ai_expert', emoji: '🏆', name: 'AI Expert', hint: 'Reach 91% accuracy in any activity' },
]

export const DECORATIONS: Decoration[] = [
  { id: 'palm', emoji: '🌴', name: 'Palm Tree' },
  { id: 'flowers', emoji: '🌺', name: 'Flowers' },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow' },
  { id: 'rocket', emoji: '🚀', name: 'Rocket' },
  { id: 'castle', emoji: '🏰', name: 'Castle' },
  { id: 'balloon', emoji: '🎈', name: 'Balloon' },
  { id: 'stars', emoji: '🌟', name: 'Star Cluster' },
  { id: 'crystal', emoji: '💎', name: 'Crystal' },
]

export const stickerById = (id: string) => STICKERS.find((s) => s.id === id)
export const decorationById = (id: string) => DECORATIONS.find((d) => d.id === id)
