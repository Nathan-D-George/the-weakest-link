# The Weakest Link

A Weakest Link-style quiz game built with React + Vite.

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## How to Play

1. **Add Players** — Enter names one at a time (minimum 2).
2. **Import Questions** — Upload an `.xlsx` file with two columns: `question` and `answer`. The first row is treated as a header and skipped.
3. **Set Round Time** — Drag the slider to choose how long each round lasts (30–300 seconds).
4. **Start Game**.

### Gameplay

- Each round, every player gets **3 questions**.
- Correct answers move up the **chain** (1 → 2 → 4 → 8 → ... → 1000).
- An **incorrect answer** breaks the chain and loses all unbanked points.
- Press **Bank** (bottom-right) before answering to secure your chain points.
- The timer counts down; if it hits zero the round ends immediately.

### After Each Round

- A ranking screen shows each player's correct/total answers.
- Select one player to eliminate and confirm.
- Last player standing wins.

### Stats

The Game Over screen shows:
- **Summary** — each player's correct answers, total questions, and percentage.
- **History** — a full log of every question, who answered it, and whether they got it right.

## Excel Format

| question | answer |
|---|---|
| What is the capital of France? | Paris |
| How many sides does a hexagon have? | 6 |

Save as `.xlsx`. The first row must be the header row.

## Project Structure

```
src/
  App.jsx                  # Screen routing and top-level state
  main.jsx                 # React entry point
  constants.js             # Point chain values, questions per player
  styles/
    global.css             # All styles (Weakest Link dark theme)
  components/
    MenuScreen.jsx         # Player setup, question import, round time
    GameScreen.jsx         # Live question/answer gameplay with timer
    EliminationScreen.jsx  # End-of-round voting and elimination
    GameOverScreen.jsx     # Final results and statistics
    OptionsModal.jsx       # Quit confirmation overlay
```
