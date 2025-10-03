import { type GameResult } from "./game";

export default function GameFinished({ result }: { result: GameResult }) {
  const numberCorrect = result.problems.filter((p) => p.correct).length;
  const duration = result.finishedAt - result.startedAt;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl text-slate-800">Training beendet!</h1>
      <p>
        Du hast {numberCorrect} von {result.problems.length} Aufgaben richtig
        gelöst. Das sind {(numberCorrect / result.problems.length) * 100} %.
      </p>
      <p>
        Dafür hast du {Math.round(duration / 1000)} Sekunden gebraucht. Das sind
        ca. {Math.floor(duration / 1000 / result.problems.length)} Sekunden pro
        Aufgabe.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
      >
        Nochmal!
      </button>
    </div>
  );
}
