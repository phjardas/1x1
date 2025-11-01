import { useEffect, useState } from "react";
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

  const { emoji, title, message, color } = getPerformanceMessage(
    result.correctRate
  );

  return (
    <div className="flex flex-col gap-6 relative">
      {result.correctRate >= 0.8 && <ConfettiEffect />}

      <div className="text-center">
        <div className="text-8xl mb-4 animate-bounce-in">{emoji}</div>
        <h1 className={`text-5xl font-bold mb-2 ${color}`}>{title}</h1>
        <p className="text-lg text-slate-700">{message}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-slate-700">
            {result.correctCount} / {result.problemCount}
          </span>
          <span className="text-3xl font-bold text-purple-600">
            {result.correctRate.toLocaleString(undefined, {
              style: "percent",
            })}
          </span>
        </div>
        <div className="rounded-full bg-slate-200 h-6 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              result.correctRate >= 0.9
                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                : result.correctRate >= 0.7
                  ? "bg-gradient-to-r from-blue-400 to-cyan-500"
                  : result.correctRate >= 0.5
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                    : "bg-gradient-to-r from-orange-400 to-red-500"
            }`}
            style={{ width: `${result.correctRate * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 shadow">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">⏱️</span>
          <span className="text-lg font-semibold text-slate-700">Zeit</span>
        </div>
        <p className="text-slate-600">
          <span className="text-2xl font-bold text-purple-600">
            {Math.round(result.duration / 1000)}
          </span>{" "}
          Sekunden insgesamt
        </p>
        <p className="text-slate-600">
          <span className="text-xl font-bold text-blue-600">
            {(result.durationPerProblem / 1000).toLocaleString(undefined, {
              maximumFractionDigits: 1,
            })}
          </span>{" "}
          Sekunden pro Aufgabe
        </p>
      </div>

      <button
        onClick={resetGame}
        className="rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 px-6 py-4 text-white text-xl font-bold hover:from-green-500 hover:to-blue-600 shadow-lg transform hover:scale-105 transition-all active:scale-95"
      >
        🎯 Nochmal trainieren!
      </button>
    </div>
  );
}

function getPerformanceMessage(correctRate: number): {
  emoji: string;
  title: string;
  message: string;
  color: string;
} {
  if (correctRate >= 0.95) {
    return {
      emoji: "🌈",
      title: "Danke fürs Mitmachen!",
      message: "Du hast dir so viel Mühe gegeben und bist bei jeder Aufgabe dabeigeblieben!",
      color: "text-yellow-500",
    };
  } else if (correctRate >= 0.85) {
    return {
      emoji: "⭐",
      title: "Du warst konzentriert!",
      message: "Ich sehe, wie konzentriert du gearbeitet hast!",
      color: "text-green-500",
    };
  } else if (correctRate >= 0.7) {
    return {
      emoji: "🌱",
      title: "Du lernst dazu!",
      message: "Du übst fleißig und lernst mit jeder Aufgabe dazu!",
      color: "text-blue-500",
    };
  } else if (correctRate >= 0.5) {
    return {
      emoji: "🎈",
      title: "Du bist dabeigeblieben!",
      message: "Du hast durchgehalten und jede Aufgabe probiert!",
      color: "text-orange-500",
    };
  } else {
    return {
      emoji: "🌟",
      title: "Danke fürs Üben!",
      message: "Du bist drangeblieben, auch als es schwierig wurde!",
      color: "text-purple-500",
    };
  }
}

function ConfettiEffect() {
  const [confetti, setConfetti] = useState<
    Array<{ id: number; left: number; delay: number; color: string }>
  >([]);

  useEffect(() => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
    ];

    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setConfetti(pieces);
  }, []);

  return (
    <>
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className={`confetti ${piece.color} rounded-full`}
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </>
  );
}
