import { type ProblemSpec } from "./model";

export default function Setup({
  startGame,
}: {
  startGame: (spec: ProblemSpec, problemCount: number) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl text-slate-800">1x1 Trainer</h1>
      <button
        onClick={() =>
          startGame(
            {
              operators: ["*"],
              minOperandValue: 0,
              maxOperandValue: 10,
            },
            10
          )
        }
        className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
      >
        Training starten
      </button>
    </div>
  );
}
