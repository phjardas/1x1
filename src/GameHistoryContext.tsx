import { type ReactNode } from "react";
import {
  LocalStorageGameHistoryRepository,
  type GameHistoryRepository,
} from "./infrastructure";
import { GameHistoryContext } from "./contexts/GameHistoryContext";

export function GameHistoryProvider({
  repository = new LocalStorageGameHistoryRepository(),
  children,
}: {
  repository?: GameHistoryRepository;
  children: ReactNode;
}) {
  return (
    <GameHistoryContext.Provider value={repository}>
      {children}
    </GameHistoryContext.Provider>
  );
}
