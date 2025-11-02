import { describe, it, expect } from "vitest";
import { NullGameHistoryRepository } from "./NullGameHistoryRepository";
import type { GameHistoryEntry } from "../db";

describe("NullGameHistoryRepository", () => {
  describe("load", () => {
    it("should always return empty history", async () => {
      const repository = new NullGameHistoryRepository();

      const history = await repository.load();

      expect(history).toEqual({ games: [] });
      expect(history.games).toHaveLength(0);
    });

    it("should return empty history even after saves", async () => {
      const repository = new NullGameHistoryRepository();
      const entry: GameHistoryEntry = {
        startedAt: Date.now(),
        finishedAt: Date.now() + 1000,
        problemCount: 10,
        correctCount: 8,
        correctRate: 0.8,
        duration: 1000,
        durationPerProblem: 100,
      };

      await repository.save(entry);
      const history = await repository.load();

      expect(history).toEqual({ games: [] });
    });

    it("should return a new object each time", async () => {
      const repository = new NullGameHistoryRepository();

      const history1 = await repository.load();
      const history2 = await repository.load();

      expect(history1).toEqual(history2);
      expect(history1).not.toBe(history2); // Different object references
    });
  });

  describe("save", () => {
    it("should accept a game result without throwing", async () => {
      const repository = new NullGameHistoryRepository();
      const entry: GameHistoryEntry = {
        startedAt: Date.now(),
        finishedAt: Date.now() + 5000,
        problemCount: 20,
        correctCount: 15,
        correctRate: 0.75,
        duration: 5000,
        durationPerProblem: 250,
      };

      await expect(repository.save(entry)).resolves.toBeUndefined();
    });

    it("should not persist any data", async () => {
      const repository = new NullGameHistoryRepository();
      const entries: GameHistoryEntry[] = [
        {
          startedAt: 1000,
          finishedAt: 2000,
          problemCount: 10,
          correctCount: 10,
          correctRate: 1,
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
      ];

      for (const entry of entries) {
        await repository.save(entry);
      }

      const history = await repository.load();
      expect(history.games).toHaveLength(0);
    });

    it("should complete save operation synchronously", async () => {
      const repository = new NullGameHistoryRepository();
      const entry: GameHistoryEntry = {
        startedAt: Date.now(),
        finishedAt: Date.now(),
        problemCount: 1,
        correctCount: 1,
        correctRate: 1,
        duration: 100,
        durationPerProblem: 100,
      };

      const result = repository.save(entry);
      expect(result).toBeInstanceOf(Promise);
      await expect(result).resolves.toBeUndefined();
    });
  });

  describe("use cases", () => {
    it("should be suitable for testing without side effects", async () => {
      const repository = new NullGameHistoryRepository();

      // Simulate a test scenario
      const testEntry: GameHistoryEntry = {
        startedAt: 1000,
        finishedAt: 2000,
        problemCount: 10,
        correctCount: 8,
        correctRate: 0.8,
        duration: 1000,
        durationPerProblem: 100,
      };

      await repository.save(testEntry);

      // No cleanup needed - nothing was persisted
      const history = await repository.load();
      expect(history.games).toHaveLength(0);
    });

    it("should be suitable for privacy mode", async () => {
      const repository = new NullGameHistoryRepository();

      // User plays multiple games
      for (let i = 0; i < 5; i++) {
        await repository.save({
          startedAt: i * 1000,
          finishedAt: i * 1000 + 500,
          problemCount: 10,
          correctCount: Math.floor(Math.random() * 10),
          correctRate: Math.random(),
          duration: 500,
          durationPerProblem: 50,
        });
      }

      // No history is retained
      const history = await repository.load();
      expect(history.games).toHaveLength(0);
    });

    it("should implement GameHistoryRepository interface", () => {
      const repository = new NullGameHistoryRepository();

      expect(repository).toHaveProperty("load");
      expect(repository).toHaveProperty("save");
      expect(typeof repository.load).toBe("function");
      expect(typeof repository.save).toBe("function");
    });
  });
});
