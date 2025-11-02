import { createContext } from "react";
import {
  LocalStorageGameHistoryRepository,
  type GameHistoryRepository,
} from "../infrastructure";

/**
 * React Context for GameHistoryRepository dependency injection.
 *
 * This enables the Nullables pattern in React components:
 * - Production: uses LocalStorageGameHistoryRepository
 * - Testing: can provide NullGameHistoryRepository or mock implementations
 * - Privacy mode: can use NullGameHistoryRepository to disable persistence
 */
export const GameHistoryContext = createContext<GameHistoryRepository>(
  new LocalStorageGameHistoryRepository()
);
