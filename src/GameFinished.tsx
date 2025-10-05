import { useEffect } from "react";
import { saveGameResult } from "./db";
import { type GameResult } from "./game";

export default function GameFinished({
  result,
  resetGame,
}: {
  result: GameResult;
  resetGame: () => void;
}) {
  useEffect(() => {
    saveGameResult(result);
  }, [result]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl text-slate-800">Geschafft!</h1>
      <p>
        Du hast {result.correctCount.toLocaleString()} von{" "}
        {result.problemCount.toLocaleString()} Aufgaben richtig gelöst. Das sind{" "}
        {result.correctRate.toLocaleString(undefined, {
          style: "percent",
        })}
        .
      </p>
      <p>
        Dafür hast du {Math.round(result.duration / 1000).toLocaleString()}{" "}
        Sekunden gebraucht. Das sind ca.{" "}
        {(result.durationPerProblem / 1000).toLocaleString(undefined, {
          maximumFractionDigits: 1,
        })}{" "}
        Sekunden pro Aufgabe.
      </p>
      <button
        onClick={resetGame}
        className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
      >
        Nochmal!
      </button>
    </div>
  );
}
