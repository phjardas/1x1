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

export async function loadGameHistory(): Promise<GameHistory> {
  const json = localStorage.getItem(storageKey);
  if (!json) return { games: [] };

  const data = JSON.parse(json) as HistoryData;
  return toGameHistory(data);
}

export async function saveGameResult(result: GameHistoryEntry): Promise<void> {
  const history = await loadGameHistory();
  const next: GameHistory = {
    ...history,
    games: [...history.games, result],
  };

  localStorage.setItem(storageKey, JSON.stringify(toHistoryData(next)));
}

function toGameHistory(data: HistoryData): GameHistory {
  switch (data.version) {
    case 1:
      return toGameHistoryV1(data);
    default:
      throw new Error(`Unsupported history data version: ${data.version}`);
  }
}

function toGameHistoryV1(data: HistoryDataV1): GameHistory {
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

function toHistoryData(history: GameHistory): HistoryData {
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

const storageKey = "1x1:history";

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
