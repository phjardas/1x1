import type { GameHistory, GameHistoryEntry } from "../db";
import type { GameHistoryRepository } from "./GameHistoryRepository";

/**
 * LocalStorage implementation of GameHistoryRepository.
 *
 * This implementation persists game history to the browser's localStorage
 * using a versioned schema for backward compatibility.
 */
export class LocalStorageGameHistoryRepository
  implements GameHistoryRepository
{
  private readonly storageKey = "1x1:history";

  async load(): Promise<GameHistory> {
    const json = localStorage.getItem(this.storageKey);
    if (!json) return { games: [] };

    const data = JSON.parse(json) as HistoryData;
    return this.toGameHistory(data);
  }

  async save(result: GameHistoryEntry): Promise<void> {
    const history = await this.load();
    const next: GameHistory = {
      ...history,
      games: [...history.games, result],
    };

    localStorage.setItem(this.storageKey, JSON.stringify(this.toHistoryData(next)));
  }

  private toGameHistory(data: HistoryData): GameHistory {
    switch (data.version) {
      case 1:
        return this.toGameHistoryV1(data);
      default:
        throw new Error(`Unsupported history data version: ${data.version}`);
    }
  }

  private toGameHistoryV1(data: HistoryDataV1): GameHistory {
    return {
      games: (data.games ?? [])?.map((game) => ({
        startedAt: game.startedAt,
        finishedAt: game.finishedAt,
        problemCount: game.problemCount,
        correctCount: game.correctCount,
        correctRate: game.correctRate,
        duration: game.duration,
        durationPerProblem: game.durationPerProblem,
      })),
    };
  }

  private toHistoryData(history: GameHistory): HistoryData {
    return {
      version: 1,
      games: history.games.map((game) => ({
        startedAt: game.startedAt,
        finishedAt: game.finishedAt,
        problemCount: game.problemCount,
        correctCount: game.correctCount,
        correctRate: game.correctRate,
        duration: game.duration,
        durationPerProblem: game.durationPerProblem,
      })),
    };
  }
}

type GameResultV1 = {
  startedAt: number;
  finishedAt: number;
  problemCount: number;
  correctCount: number;
  correctRate: number;
  duration: number;
  durationPerProblem: number;
};

type HistoryDataV1 = {
  version: 1;
  games?: readonly GameResultV1[];
};

type HistoryData = HistoryDataV1;
