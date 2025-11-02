import { useContext } from "react";
import { GameHistoryContext } from "../contexts/GameHistoryContext";
import type { GameHistoryRepository } from "../infrastructure";

/**
 * Hook to access the current GameHistoryRepository.
 */
export function useGameHistoryRepository(): GameHistoryRepository {
  return useContext(GameHistoryContext);
}
