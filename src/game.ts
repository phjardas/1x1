import { createProblems, type Problem, type ProblemSpec } from "./model";

export class Game {
  private readonly spec: ProblemSpec;
  readonly problems: readonly Problem[];
  readonly solutions: number[];
  readonly startedAt: number;
  currentProblemIndex: number;

  constructor(spec: ProblemSpec, count: number) {
    this.spec = spec;
    this.problems = createProblems(spec, count);
    this.solutions = new Array(count).fill(NaN);
    this.startedAt = Date.now();
    this.currentProblemIndex = 0;
  }

  get currentProblem(): Problem | undefined {
    return this.problems[this.currentProblemIndex];
  }

  registerSolution(solution: number): GameResult | undefined {
    if (
      this.currentProblemIndex < 0 ||
      this.currentProblemIndex >= this.problems.length
    ) {
      throw new Error("No current problem");
    }

    this.solutions[this.currentProblemIndex] = solution;
    this.currentProblemIndex++;
    return this.createResultIfFinished();
  }

  private createResultIfFinished(): GameResult | undefined {
    if (this.currentProblemIndex === this.problems.length) {
      const finishedAt = Date.now();
      const problems = createProblemResults(this.problems, this.solutions);
      const correctCount = problems.filter((p) => p.correct).length;
      const correctRate = correctCount / problems.length;
      const duration = finishedAt - this.startedAt;
      const durationPerProblem = duration / problems.length;

      return {
        spec: this.spec,
        problems,
        startedAt: this.startedAt,
        finishedAt,
        problemCount: problems.length,
        correctCount,
        correctRate,
        duration,
        durationPerProblem,
      };
    }
  }
}

function createProblemResults(
  problems: readonly Problem[],
  solutions: readonly number[]
): readonly ProblemResult[] {
  return problems.map((problem, index) => {
    const solution = solutions[index];
    const correctSolution =
      problem.unknown === "operand1"
        ? problem.operand1
        : problem.unknown === "operand2"
          ? problem.operand2
          : problem.result;

    return {
      ...problem,
      solution,
      correct: solution === correctSolution,
    };
  });
}

export type GameResult = {
  spec: ProblemSpec;
  problems: readonly ProblemResult[];
  startedAt: number;
  finishedAt: number;
  problemCount: number;
  correctCount: number;
  correctRate: number;
  duration: number;
  durationPerProblem: number;
};

export type ProblemResult = Problem & { solution: number; correct: boolean };
