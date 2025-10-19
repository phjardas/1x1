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
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <h1 className="text-4xl text-slate-800 text-center">1×1 Trainer</h1>
      <div className="flex gap-2 items-baseline">
        <label htmlFor="count">Anzahl der Aufgaben:</label>
        <input
          type="text"
          id="count"
          value={isNaN(count) ? "" : count}
          onChange={(e) => setCount(Number(e.target.value))}
          inputMode="numeric"
          required
          className="border border-slate-500 bg-white rounded px-2 py-1 w-12 text-right"
        />
      </div>
      <button
        type="submit"
        className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:bg-gray-700/30 shadow"
        disabled={isNaN(count) || count <= 0}
      >
        Training starten
      </button>
    </form>
  );
}
