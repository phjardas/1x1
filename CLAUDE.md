# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a kid-friendly multiplication (1×1) practice application built with React, TypeScript, Vite, and Tailwind CSS v4. The app helps children practice multiplication tables through an interactive, colorful interface with animations and encouraging feedback.

## Development Commands

```bash
npm start         # Start dev server (Vite)
npm run build     # Type-check with tsc and build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Architecture

### State Machine Pattern

The app follows a three-state flow controlled by `App.tsx`:

1. **Setup** (`Setup.tsx`) - User configures problem count and difficulty
2. **Running** (`GameRunning.tsx`) - User solves problems sequentially with real-time feedback
3. **Ended** (`GameFinished.tsx`) - Shows results, stats, and encouraging messages

State transitions are unidirectional: setup → running → ended → setup.

### Core Game Logic

- **`model.ts`** - Problem generation and types. Creates unique problems based on `ProblemSpec` (operators, min/max operand values). Each problem has one unknown: operand1, operand2, or result.
- **`game.ts`** - Game class manages problem set, tracks solutions, and calculates results (correctness, timing metrics).
- **`db.ts`** - LocalStorage persistence with versioned schema (`version: 1`). Uses `GameHistory` to track all completed games.

### Data Flow

1. User submits answer in `GameRunning.tsx`
2. `Game.registerSolution()` records answer and advances problem index
3. When all problems complete, returns `GameResult`
4. `GameFinished.tsx` saves result to localStorage via `saveGameResult()`

## Important Design Principles

### Kid-Friendly Design

The app uses colorful gradients, large emojis, playful animations, and child-appropriate UI elements (from PR #1). Maintain this aesthetic in any UI changes.

### Nonviolent Communication

All feedback messages use nonviolent, encouraging language (from PR #2). Messages focus on:
- Effort and participation rather than just correctness
- What the child did well
- Acknowledgment without judgment

Examples:
- "Danke fürs Mitmachen!" instead of "Perfekt!"
- "Du hast dir so viel Mühe gegeben" instead of "Super gemacht!"

When adding or modifying feedback text, follow this pattern in `GameFinished.tsx:getPerformanceMessage()`.

### LocalStorage Schema Versioning

The `db.ts` module uses a versioned schema pattern. When modifying stored data:
1. Increment version number
2. Add new type (e.g., `HistoryDataV2`)
3. Update union type `HistoryData`
4. Add migration function in `toGameHistory()`

## Project Configuration

- **TypeScript**: Uses project references (tsconfig.json, tsconfig.app.json, tsconfig.node.json)
- **Tailwind CSS v4**: Imported in styles.css with custom animations
- **Vite**: Uses SWC for fast React refresh (@vitejs/plugin-react-swc)

## Current Problem Configuration

Currently hardcoded in `Setup.tsx`:
- Operators: multiplication only (`["*"]`)
- Operand range: 2-9
- Problem count: user-configurable (default 20)

The code supports addition (`"+"`) but it's not currently enabled in the UI.
