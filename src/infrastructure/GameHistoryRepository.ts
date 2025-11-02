import type { GameHistory, GameHistoryEntry } from "../db";

/**
 * Repository interface for game history persistence.
 *
 * This interface follows the Nullables pattern, allowing for
 * both real implementations (e.g., localStorage) and null
 * implementations (e.g., no-op for testing).
 */
export interface GameHistoryRepository {
  /**
   * Load the complete game history.
   */
  load(): Promise<GameHistory>;

  /**
   * Save a new game result to the history.
   */
  save(result: GameHistoryEntry): Promise<void>;
}
