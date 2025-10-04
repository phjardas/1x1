import { type GameResult } from "./game";

export default function GameFinished({
  result,
  resetGame,
}: {
  result: GameResult;
  resetGame: () => void;
}) {
  const numberCorrect = result.problems.filter((p) => p.correct).length;
  const duration = result.finishedAt - result.startedAt;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl text-slate-800">Training beendet!</h1>
      <p>
        Du hast {numberCorrect.toLocaleString()} von{" "}
        {result.problems.length.toLocaleString()} Aufgaben richtig gelöst. Das
        sind{" "}
        {(numberCorrect / result.problems.length).toLocaleString(undefined, {
          style: "percent",
        })}
        .
      </p>
      <p>
        Dafür hast du {Math.round(duration / 1000).toLocaleString()} Sekunden
        gebraucht. Das sind ca.{" "}
        {(duration / 1000 / result.problems.length).toLocaleString(undefined, {
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
