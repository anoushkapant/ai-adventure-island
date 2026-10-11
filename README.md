# AI Adventure Island 🏝️🤖

A colorful, story-driven game for primary school students (ages 6–12) to learn AI concepts through play. Children become AI Explorers teaching cute animal robot friends.

**Tagline:** 🧠 *"Learn AI by teaching your own friendly robot friends!"*

## Play it

Live at GitHub Pages — URL shown in the repo's **Environments** tab after the first deploy.

## Running locally

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build (dist/)
npm run lint      # oxlint
```

## What's inside

- **Robot Lab** — meet Bot-Bot and learn AI words
- **Training Center** — Teach the Robot, Build Your AI Pet, Train the Dragon
- **AI Challenges** — Robot Detective, Spot the Bias
- **Rewards Castle** — stars, robot parts, stickers, island decorations
- **AI Storybook** — kid-friendly stories about AI

## How the "AI" works

Fully client-side, rule-based simulation (`src/lib/ai.ts`). The robot remembers which traits appeared in each category and gains confidence as it sees more examples. With little or unbalanced data it falls back to the most-seen category — exactly how real biased models behave. No cloud services, no data collection, child-safe.

## Accessibility

Text-to-speech, dyslexia-friendly font option, colorblind mode, and large touch targets — all under ⚙️ Settings.

## License

MIT — see [LICENSE](LICENSE).