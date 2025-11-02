import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  loadGameHistory,
  saveGameResult,
  setRepository,
  getRepository,
  type GameHistoryEntry,
} from "./db";
import {
  NullGameHistoryRepository,
  LocalStorageGameHistoryRepository,
  type GameHistoryRepository,
} from "./infrastructure";

describe("db.ts repository pattern", () => {
  let originalRepository: GameHistoryRepository;

  beforeEach(() => {
    // Save the original repository
    originalRepository = getRepository();
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    // Restore the original repository
    setRepository(originalRepository);
    // Clean up localStorage
    localStorage.clear();
  });

  describe("setRepository", () => {
    it("should allow setting a custom repository", () => {
      const nullRepo = new NullGameHistoryRepository();

      setRepository(nullRepo);

      expect(getRepository()).toBe(nullRepo);
    });

    it("should replace the previous repository", () => {
      const nullRepo = new NullGameHistoryRepository();
      const localStorageRepo = new LocalStorageGameHistoryRepository();

      setRepository(nullRepo);
      expect(getRepository()).toBe(nullRepo);

      setRepository(localStorageRepo);
      expect(getRepository()).toBe(localStorageRepo);
    });
  });

  describe("getRepository", () => {
    it("should return LocalStorageGameHistoryRepository by default", () => {
      // Reset to default
      setRepository(new LocalStorageGameHistoryRepository());

      const repo = getRepository();

      expect(repo).toBeInstanceOf(LocalStorageGameHistoryRepository);
    });

    it("should return the currently configured repository", () => {
      const nullRepo = new NullGameHistoryRepository();
      setRepository(nullRepo);

      const repo = getRepository();

      expect(repo).toBe(nullRepo);
    });
  });

  describe("loadGameHistory", () => {
    it("should delegate to the configured repository", async () => {
      const mockRepo: GameHistoryRepository = {
        load: vi.fn().mockResolvedValue({ games: [] }),
        save: vi.fn(),
      };
      setRepository(mockRepo);

      await loadGameHistory();

      expect(mockRepo.load).toHaveBeenCalledTimes(1);
    });

    it("should return empty history with NullGameHistoryRepository", async () => {
      setRepository(new NullGameHistoryRepository());

      const history = await loadGameHistory();

      expect(history).toEqual({ games: [] });
    });

    it("should load data from LocalStorageGameHistoryRepository", async () => {
      setRepository(new LocalStorageGameHistoryRepository());

      // Pre-populate localStorage
      const testData = {
        version: 1,
        games: [
          {
            startedAt: 1000,
            finishedAt: 2000,
            problemCount: 10,
            correctCount: 8,
            correctRate: 0.8,
            duration: 1000,
            durationPerProblem: 100,
          },
        ],
      };
      localStorage.setItem("1x1:history", JSON.stringify(testData));

      const history = await loadGameHistory();

      expect(history.games).toHaveLength(1);
      expect(history.games[0]).toEqual(testData.games[0]);
    });
  });

  describe("saveGameResult", () => {
    it("should delegate to the configured repository", async () => {
      const mockRepo: GameHistoryRepository = {
        load: vi.fn(),
        save: vi.fn().mockResolvedValue(undefined),
      };
      setRepository(mockRepo);

      const entry: GameHistoryEntry = {
        startedAt: 1000,
        finishedAt: 2000,
        problemCount: 10,
        correctCount: 8,
        correctRate: 0.8,
        duration: 1000,
        durationPerProblem: 100,
      };

      await saveGameResult(entry);

      expect(mockRepo.save).toHaveBeenCalledTimes(1);
      expect(mockRepo.save).toHaveBeenCalledWith(entry);
    });

    it("should do nothing with NullGameHistoryRepository", async () => {
      setRepository(new NullGameHistoryRepository());

      const entry: GameHistoryEntry = {
        startedAt: 1000,
        finishedAt: 2000,
        problemCount: 10,
        correctCount: 8,
        correctRate: 0.8,
        duration: 1000,
        durationPerProblem: 100,
      };

      await saveGameResult(entry);

      const history = await loadGameHistory();
      expect(history.games).toHaveLength(0);
    });

    it("should save data with LocalStorageGameHistoryRepository", async () => {
      setRepository(new LocalStorageGameHistoryRepository());

      const entry: GameHistoryEntry = {
        startedAt: 1000,
        finishedAt: 2000,
        problemCount: 10,
        correctCount: 8,
        correctRate: 0.8,
        duration: 1000,
        durationPerProblem: 100,
      };

      await saveGameResult(entry);

      const history = await loadGameHistory();
      expect(history.games).toHaveLength(1);
      expect(history.games[0]).toEqual(entry);
    });
  });

  describe("dependency injection patterns", () => {
    it("should allow swapping repositories at runtime", async () => {
      const entry: GameHistoryEntry = {
        startedAt: 1000,
        finishedAt: 2000,
        problemCount: 10,
        correctCount: 8,
        correctRate: 0.8,
        duration: 1000,
        durationPerProblem: 100,
      };

      // Start with localStorage
      setRepository(new LocalStorageGameHistoryRepository());
      await saveGameResult(entry);

      let history = await loadGameHistory();
      expect(history.games).toHaveLength(1);

      // Switch to null repository
      setRepository(new NullGameHistoryRepository());
      history = await loadGameHistory();
      expect(history.games).toHaveLength(0);

      // Switch back to localStorage (data should still be there)
      setRepository(new LocalStorageGameHistoryRepository());
      history = await loadGameHistory();
      expect(history.games).toHaveLength(1);
    });

    it("should enable testing with NullGameHistoryRepository", async () => {
      // Test scenario: user wants to test game logic without persistence
      setRepository(new NullGameHistoryRepository());

      const entries: GameHistoryEntry[] = Array.from({ length: 10 }, (_, i) => ({
        startedAt: i * 1000,
        finishedAt: i * 1000 + 500,
        problemCount: 10,
        correctCount: Math.floor(Math.random() * 10),
        correctRate: Math.random(),
        duration: 500,
        durationPerProblem: 50,
      }));

      // Save multiple entries
      for (const entry of entries) {
        await saveGameResult(entry);
      }

      // No side effects - nothing persisted
      const history = await loadGameHistory();
      expect(history.games).toHaveLength(0);
    });

    it("should support custom mock implementations", async () => {
      const mockGames = [
        {
          startedAt: 1000,
          finishedAt: 2000,
          problemCount: 10,
          correctCount: 10,
          correctRate: 1,
          duration: 1000,
          durationPerProblem: 100,
        },
      ];

      const mockRepo: GameHistoryRepository = {
        load: vi.fn().mockResolvedValue({ games: mockGames }),
        save: vi.fn().mockResolvedValue(undefined),
      };

      setRepository(mockRepo);

      const history = await loadGameHistory();
      expect(history.games).toEqual(mockGames);
      expect(mockRepo.load).toHaveBeenCalled();
    });
  });

  describe("backward compatibility", () => {
    it("should maintain the original API surface", async () => {
      // The db module should still export the same functions
      expect(typeof loadGameHistory).toBe("function");
      expect(typeof saveGameResult).toBe("function");
      expect(typeof setRepository).toBe("function");
      expect(typeof getRepository).toBe("function");
    });

    it("should work without calling setRepository", async () => {
      // Users should be able to use the default repository without configuration
      const entry: GameHistoryEntry = {
        startedAt: 1000,
        finishedAt: 2000,
        problemCount: 10,
        correctCount: 8,
        correctRate: 0.8,
        duration: 1000,
        durationPerProblem: 100,
      };

      // Reset to default localStorage repository
      setRepository(new LocalStorageGameHistoryRepository());

      await saveGameResult(entry);
      const history = await loadGameHistory();

      expect(history.games).toHaveLength(1);
    });
  });

  describe("integration scenarios", () => {
    it("should handle complete game flow with persistence", async () => {
      setRepository(new LocalStorageGameHistoryRepository());

      // Simulate multiple game sessions
      const sessions: GameHistoryEntry[] = [
        {
          startedAt: 1000,
          finishedAt: 2000,
          problemCount: 10,
          correctCount: 8,
          correctRate: 0.8,
          duration: 1000,
          durationPerProblem: 100,
        },
        {
          startedAt: 3000,
          finishedAt: 4000,
          problemCount: 20,
          correctCount: 18,
          correctRate: 0.9,
          duration: 1000,
          durationPerProblem: 50,
        },
        {
          startedAt: 5000,
          finishedAt: 6000,
          problemCount: 5,
          correctCount: 5,
          correctRate: 1,
          duration: 1000,
          durationPerProblem: 200,
        },
      ];

      // Save each session
      for (const session of sessions) {
        await saveGameResult(session);
      }

      // Load and verify
      const history = await loadGameHistory();
      expect(history.games).toHaveLength(3);
      expect(history.games).toEqual(sessions);
    });

    it("should handle complete game flow without persistence", async () => {
      setRepository(new NullGameHistoryRepository());

      // Play several games
      for (let i = 0; i < 5; i++) {
        await saveGameResult({
          startedAt: i * 1000,
          finishedAt: i * 1000 + 500,
          problemCount: 10,
          correctCount: Math.floor(Math.random() * 10),
          correctRate: Math.random(),
          duration: 500,
          durationPerProblem: 50,
        });
      }

      // History should be empty (privacy mode)
      const history = await loadGameHistory();
      expect(history.games).toHaveLength(0);
    });
  });

  describe("error handling", () => {
    it("should propagate errors from repository.load()", async () => {
      const mockRepo: GameHistoryRepository = {
        load: vi.fn().mockRejectedValue(new Error("Load failed")),
        save: vi.fn(),
      };
      setRepository(mockRepo);

      await expect(loadGameHistory()).rejects.toThrow("Load failed");
    });

    it("should propagate errors from repository.save()", async () => {
      const mockRepo: GameHistoryRepository = {
        load: vi.fn(),
        save: vi.fn().mockRejectedValue(new Error("Save failed")),
      };
      setRepository(mockRepo);

      const entry: GameHistoryEntry = {
        startedAt: 1000,
        finishedAt: 2000,
        problemCount: 10,
        correctCount: 8,
        correctRate: 0.8,
        duration: 1000,
        durationPerProblem: 100,
      };

      await expect(saveGameResult(entry)).rejects.toThrow("Save failed");
    });
  });
});
