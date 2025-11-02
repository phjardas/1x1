import { FormEvent, useCallback, useState } from "react";
import { type Operator, type ProblemSpec } from "./model";

export default function Setup({
  startGame,
}: {
  startGame: (spec: ProblemSpec, problemCount: number) => void;
}) {
  const [count, setCount] = useState(20);
  const [minOperandValue] = useState(2);
  const [maxOperandValue] = useState(9);
  const [operators] = useState<readonly Operator[]>(["*"]);

  const submit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      startGame({ operators, minOperandValue, maxOperandValue }, count);
    },
    [startGame, operators, minOperandValue, maxOperandValue, count]
  );

  return (
    <form className="flex flex-col gap-6" onSubmit={submit}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <img
            src="/logo.svg"
            alt="1×1 Trainer Logo"
            className="w-24 h-24 animate-float"
          />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          1×1 Trainer
        </h1>
        <p className="text-lg text-slate-700 mt-2">Werde zum Mathe-Champion!</p>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="count" className="text-lg font-semibold text-slate-700">
          Wie viele Aufgaben möchtest du üben?
        </label>
        <input
          type="text"
          id="count"
          value={isNaN(count) ? "" : count}
          onChange={(e) => setCount(Number(e.target.value))}
          inputMode="numeric"
          required
          className="border-3 border-purple-400 bg-white rounded-xl px-4 py-3 text-2xl text-center font-bold text-purple-700 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-200 transition-all"
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-gradient-to-r from-green-400 to-blue-500 px-6 py-4 text-white text-xl font-bold hover:from-green-500 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 shadow-lg transform hover:scale-105 transition-all active:scale-95"
        disabled={isNaN(count) || count <= 0}
      >
        🚀 Los geht's!
      </button>
    </form>
  );
}
