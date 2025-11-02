import type { GameHistory, GameHistoryEntry } from "../db";
import type { GameHistoryRepository } from "./GameHistoryRepository";

/**
 * Null implementation of GameHistoryRepository.
 *
 * This implementation performs no actual persistence operations.
 * It always returns an empty history and discards any saves.
 *
 * Use cases:
 * - Testing without side effects
 * - Development without persistence
 * - Privacy mode where history should not be stored
 */
export class NullGameHistoryRepository implements GameHistoryRepository {
  async load(): Promise<GameHistory> {
    return { games: [] };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async save(_result: GameHistoryEntry): Promise<void> {
    // No-op: discard the result
  }
}
