import { useCallback, useState } from "react";
import { type Game, type GameResult } from "./game";
import { Problem } from "./model";

export function GameRunning({
  game,
  onGameEnd,
}: {
  game: Game;
  onGameEnd: (result: GameResult) => void;
}) {
  const [step, setStep] = useState(0);

  const onSubmit = useCallback(
    (value: number) => {
      const result = game.registerSolution(value);
      if (result) return onGameEnd(result);
      setStep((s) => s + 1);
    },
    [game, onGameEnd]
  );

  return <CurrentProblem key={step} game={game} onSubmit={onSubmit} />;
}

function CurrentProblem({
  game,
  onSubmit,
}: {
  game: Game;
  onSubmit: (value: number) => void;
}) {
  const problem = game.currentProblem;
  if (!problem) return null;

  return (
    <div className="flex flex-col gap-2">
      <ProblemInput key={problem.id} problem={problem} onSubmit={onSubmit} />
      <p className="text-xs text-slate-500 text-end">
        Aufgabe {game.currentProblemIndex + 1} von {game.problems.length}
      </p>
    </div>
  );
}

function ProblemInput({
  problem,
  onSubmit,
}: {
  problem: Problem;
  onSubmit: (value: number) => void;
}) {
  const [value, setValue] = useState<number>(NaN);

  return (
    <form
      className="flex items-baseline gap-2 text-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        if (!isNaN(value)) onSubmit(value);
      }}
    >
      {problem.unknown === "operand1" ? (
        <NumberInput value={value} onChange={setValue} />
      ) : (
        <span>{problem.operand1}</span>
      )}
      <span>{problem.operator === "*" ? "×" : problem.operator}</span>
      {problem.unknown === "operand2" ? (
        <NumberInput value={value} onChange={setValue} />
      ) : (
        <span>{problem.operand2}</span>
      )}
      <span>=</span>
      {problem.unknown === "result" ? (
        <NumberInput value={value} onChange={setValue} />
      ) : (
        <span>{problem.result}</span>
      )}
      <button type="submit">&rarr;</button>
    </form>
  );
}

function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      value={isNaN(value) ? "" : value.toString()}
      onChange={(e) =>
        onChange(parseInt(e.target.value.replace(/[^\d]/g, ""), 10))
      }
      className="border border-slate-500 bg-white rounded px-2 py-1 w-12 text-right"
      inputMode="numeric"
      autoFocus
    />
  );
}
