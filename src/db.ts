import {
  LocalStorageGameHistoryRepository,
  type GameHistoryRepository,
} from "./infrastructure";

export type GameHistory = {
  games: readonly GameHistoryEntry[];
};

export type GameHistoryEntry = {
  startedAt: number;
  finishedAt: number;
  problemCount: number;
  correctCount: number;
  correctRate: number;
  duration: number;
  durationPerProblem: number;
};

/**
 * Default repository instance using localStorage.
 * Can be overridden using setRepository() for testing or alternative implementations.
 */
let repository: GameHistoryRepository = new LocalStorageGameHistoryRepository();

/**
 * Configure the repository implementation.
 * Useful for testing with NullGameHistoryRepository or other implementations.
 */
export function setRepository(newRepository: GameHistoryRepository): void {
  repository = newRepository;
}

/**
 * Get the current repository instance.
 */
export function getRepository(): GameHistoryRepository {
  return repository;
}

/**
 * Load game history using the configured repository.
 */
export async function loadGameHistory(): Promise<GameHistory> {
  return repository.load();
}

/**
 * Save a game result using the configured repository.
 */
export async function saveGameResult(result: GameHistoryEntry): Promise<void> {
  return repository.save(result);
}
