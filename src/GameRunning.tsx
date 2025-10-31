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
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );

  const onSubmit = useCallback(
    (value: number, isCorrect: boolean) => {
      // Register solution immediately to capture correct timestamp
      const result = game.registerSolution(value);

      // Show feedback animation
      setFeedback(isCorrect ? "correct" : "incorrect");

      // Wait 1 second to show feedback before moving on
      setTimeout(() => {
        setFeedback(null);
        if (result) return onGameEnd(result);
        setStep((s) => s + 1);
      }, 1000);
    },
    [game, onGameEnd]
  );

  return (
    <>
      {feedback && <FeedbackOverlay correct={feedback === "correct"} />}
      <CurrentProblem key={step} game={game} onSubmit={onSubmit} />
    </>
  );
}

function FeedbackOverlay({ correct }: { correct: boolean }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div
        className={`text-9xl animate-bounce-in ${
          correct ? "animate-pulse-scale" : "animate-shake"
        }`}
      >
        {correct ? "✅" : "❌"}
      </div>
    </div>
  );
}

function CurrentProblem({
  game,
  onSubmit,
}: {
  game: Game;
  onSubmit: (value: number, isCorrect: boolean) => void;
}) {
  const problem = game.currentProblem;
  if (!problem) return null;

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold px-4 py-2 rounded-full text-sm shadow-md">
          ⭐ Aufgabe {game.currentProblemIndex + 1} von {game.problems.length}
        </div>
      </div>
      <ProblemInput key={problem.id} problem={problem} onSubmit={onSubmit} />
    </div>
  );
}

function ProblemInput({
  problem,
  onSubmit,
}: {
  problem: Problem;
  onSubmit: (value: number, isCorrect: boolean) => void;
}) {
  const [value, setValue] = useState<number>(NaN);

  const correctAnswer =
    problem.unknown === "operand1"
      ? problem.operand1
      : problem.unknown === "operand2"
        ? problem.operand2
        : problem.result;

  return (
    <form
      className="flex justify-center items-baseline gap-3 text-4xl font-bold"
      onSubmit={(e) => {
        e.preventDefault();
        if (!isNaN(value)) {
          const isCorrect = value === correctAnswer;
          onSubmit(value, isCorrect);
        }
      }}
    >
      {problem.unknown === "operand1" ? (
        <NumberInput value={value} onChange={setValue} />
      ) : (
        <span className="text-blue-600">{problem.operand1}</span>
      )}
      <span className="text-purple-500">×</span>
      {problem.unknown === "operand2" ? (
        <NumberInput value={value} onChange={setValue} />
      ) : (
        <span className="text-blue-600">{problem.operand2}</span>
      )}
      <span className="text-purple-500">=</span>
      {problem.unknown === "result" ? (
        <NumberInput value={value} onChange={setValue} />
      ) : (
        <span className="text-blue-600">{problem.result}</span>
      )}
      <button
        type="submit"
        className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg px-4 py-2 text-2xl hover:from-green-500 hover:to-blue-600 shadow-md transform hover:scale-110 transition-all active:scale-95"
      >
        ✓
      </button>
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
      className="border-4 border-pink-400 bg-white rounded-xl px-4 py-2 w-20 text-center text-purple-700 font-bold focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all"
      inputMode="numeric"
      autoFocus
    />
  );
}
