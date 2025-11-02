import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { LocalStorageGameHistoryRepository } from "./LocalStorageGameHistoryRepository";
import type { GameHistoryEntry } from "../db";

describe("LocalStorageGameHistoryRepository", () => {
  const STORAGE_KEY = "1x1:history";
  let repository: LocalStorageGameHistoryRepository;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    repository = new LocalStorageGameHistoryRepository();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe("load", () => {
    it("should return empty history when localStorage is empty", async () => {
      const history = await repository.load();

      expect(history).toEqual({ games: [] });
      expect(history.games).toHaveLength(0);
    });

    it("should load existing history from localStorage", async () => {
      const savedData = {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

      const history = await repository.load();

      expect(history.games).toHaveLength(1);
      expect(history.games[0]).toEqual(savedData.games[0]);
    });

    it("should handle multiple game entries", async () => {
      const savedData = {
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
          {
            startedAt: 3000,
            finishedAt: 4000,
            problemCount: 20,
            correctCount: 15,
            correctRate: 0.75,
            duration: 1000,
            durationPerProblem: 50,
          },
        ],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

      const history = await repository.load();

      expect(history.games).toHaveLength(2);
      expect(history.games[0]).toEqual(savedData.games[0]);
      expect(history.games[1]).toEqual(savedData.games[1]);
    });

    it("should handle version 1 data format", async () => {
      const savedData = {
        version: 1,
        games: [
          {
            startedAt: 5000,
            finishedAt: 6000,
            problemCount: 5,
            correctCount: 5,
            correctRate: 1,
            duration: 1000,
            durationPerProblem: 200,
          },
        ],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

      const history = await repository.load();

      expect(history.games).toHaveLength(1);
      expect(history.games[0]).toEqual(savedData.games[0]);
    });

    it("should handle missing games array in v1 data", async () => {
      const savedData = {
        version: 1,
        // games property is missing
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

      const history = await repository.load();

      expect(history.games).toHaveLength(0);
    });

    it("should throw error for unsupported version", async () => {
      const savedData = {
        version: 999,
        games: [],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

      await expect(repository.load()).rejects.toThrow(
        "Unsupported history data version: 999"
      );
    });
  });

  describe("save", () => {
    it("should save a new game result to empty localStorage", async () => {
      const entry: GameHistoryEntry = {
        startedAt: 1000,
        finishedAt: 2000,
        problemCount: 10,
        correctCount: 8,
        correctRate: 0.8,
        duration: 1000,
        durationPerProblem: 100,
      };

      await repository.save(entry);

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.version).toBe(1);
      expect(parsed.games).toHaveLength(1);
      expect(parsed.games[0]).toEqual(entry);
    });

    it("should append to existing history", async () => {
      const firstEntry: GameHistoryEntry = {
        startedAt: 1000,
        finishedAt: 2000,
        problemCount: 10,
        correctCount: 8,
        correctRate: 0.8,
        duration: 1000,
        durationPerProblem: 100,
      };

      const secondEntry: GameHistoryEntry = {
        startedAt: 3000,
        finishedAt: 4000,
        problemCount: 5,
        correctCount: 3,
        correctRate: 0.6,
        duration: 1000,
        durationPerProblem: 200,
      };

      await repository.save(firstEntry);
      await repository.save(secondEntry);

      const history = await repository.load();

      expect(history.games).toHaveLength(2);
      expect(history.games[0]).toEqual(firstEntry);
      expect(history.games[1]).toEqual(secondEntry);
    });

    it("should preserve existing games when adding new ones", async () => {
      // Pre-populate with some games
      const initialData = {
        version: 1,
        games: [
          {
            startedAt: 1000,
            finishedAt: 2000,
            problemCount: 10,
            correctCount: 10,
            correctRate: 1,
            duration: 1000,
            durationPerProblem: 100,
          },
        ],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));

      const newEntry: GameHistoryEntry = {
        startedAt: 5000,
        finishedAt: 6000,
        problemCount: 20,
        correctCount: 15,
        correctRate: 0.75,
        duration: 1000,
        durationPerProblem: 50,
      };

      await repository.save(newEntry);

      const history = await repository.load();

      expect(history.games).toHaveLength(2);
      expect(history.games[0]).toEqual(initialData.games[0]);
      expect(history.games[1]).toEqual(newEntry);
    });

    it("should use version 1 format", async () => {
      const entry: GameHistoryEntry = {
        startedAt: 1000,
        finishedAt: 2000,
        problemCount: 10,
        correctCount: 8,
        correctRate: 0.8,
        duration: 1000,
        durationPerProblem: 100,
      };

      await repository.save(entry);

      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);

      expect(parsed.version).toBe(1);
    });
  });

  describe("data persistence", () => {
    it("should persist data across repository instances", async () => {
      const entry: GameHistoryEntry = {
        startedAt: 1000,
        finishedAt: 2000,
        problemCount: 10,
        correctCount: 8,
        correctRate: 0.8,
        duration: 1000,
        durationPerProblem: 100,
      };

      const repo1 = new LocalStorageGameHistoryRepository();
      await repo1.save(entry);

      const repo2 = new LocalStorageGameHistoryRepository();
      const history = await repo2.load();

      expect(history.games).toHaveLength(1);
      expect(history.games[0]).toEqual(entry);
    });

    it("should handle rapid consecutive saves", async () => {
      const entries: GameHistoryEntry[] = [
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
          problemCount: 5,
          correctCount: 3,
          correctRate: 0.6,
          duration: 1000,
          durationPerProblem: 200,
        },
        {
          startedAt: 5000,
          finishedAt: 6000,
          problemCount: 15,
          correctCount: 12,
          correctRate: 0.8,
          duration: 1000,
          durationPerProblem: 66.67,
        },
      ];

      for (const entry of entries) {
        await repository.save(entry);
      }

      const history = await repository.load();

      expect(history.games).toHaveLength(3);
      entries.forEach((entry, index) => {
        expect(history.games[index]).toEqual(entry);
      });
    });
  });

  describe("data integrity", () => {
    it("should preserve all fields of GameHistoryEntry", async () => {
      const entry: GameHistoryEntry = {
        startedAt: 123456789,
        finishedAt: 987654321,
        problemCount: 42,
        correctCount: 35,
        correctRate: 0.8333333333,
        duration: 864164532,
        durationPerProblem: 20575345.52381,
      };

      await repository.save(entry);
      const history = await repository.load();

      expect(history.games[0]).toEqual(entry);
    });

    it("should handle zero values correctly", async () => {
      const entry: GameHistoryEntry = {
        startedAt: 0,
        finishedAt: 0,
        problemCount: 10,
        correctCount: 0,
        correctRate: 0,
        duration: 0,
        durationPerProblem: 0,
      };

      await repository.save(entry);
      const history = await repository.load();

      expect(history.games[0]).toEqual(entry);
    });

    it("should handle decimal values in correctRate", async () => {
      const entry: GameHistoryEntry = {
        startedAt: 1000,
        finishedAt: 2000,
        problemCount: 3,
        correctCount: 2,
        correctRate: 0.6666666666666666,
        duration: 1000,
        durationPerProblem: 333.3333333333333,
      };

      await repository.save(entry);
      const history = await repository.load();

      expect(history.games[0].correctRate).toBeCloseTo(0.6666666666666666);
    });
  });

  describe("interface compliance", () => {
    it("should implement GameHistoryRepository interface", () => {
      expect(repository).toHaveProperty("load");
      expect(repository).toHaveProperty("save");
      expect(typeof repository.load).toBe("function");
      expect(typeof repository.save).toBe("function");
    });

    it("should return promises from async methods", () => {
      const loadResult = repository.load();
      expect(loadResult).toBeInstanceOf(Promise);

      const entry: GameHistoryEntry = {
        startedAt: 1000,
        finishedAt: 2000,
        problemCount: 10,
        correctCount: 8,
        correctRate: 0.8,
        duration: 1000,
        durationPerProblem: 100,
      };
      const saveResult = repository.save(entry);
      expect(saveResult).toBeInstanceOf(Promise);
    });
  });

  describe("edge cases", () => {
    it("should handle corrupted localStorage data gracefully", async () => {
      localStorage.setItem(STORAGE_KEY, "not valid json");

      await expect(repository.load()).rejects.toThrow();
    });

    it("should handle very large number of games", async () => {
      const manyGames = Array.from({ length: 100 }, (_, i) => ({
        startedAt: i * 1000,
        finishedAt: i * 1000 + 500,
        problemCount: 10,
        correctCount: Math.floor(Math.random() * 10),
        correctRate: Math.random(),
        duration: 500,
        durationPerProblem: 50,
      }));

      const data = {
        version: 1,
        games: manyGames,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      const history = await repository.load();

      expect(history.games).toHaveLength(100);
    });
  });
});
