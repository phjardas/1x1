import { useState } from "react";
import { type ProblemSpec } from "./model";

export default function Setup({
  startGame,
}: {
  startGame: (spec: ProblemSpec, problemCount: number) => void;
}) {
  const [spec, setSpec] = useState<ProblemSpec>({
    operators: ["*"],
    minOperandValue: 0,
    maxOperandValue: 10,
  });
  const [problemCount, setProblemCount] = useState(10);

  return (
    <div>
      <pre>{JSON.stringify({ spec, problemCount }, null, 2)}</pre>
      <button onClick={() => startGame(spec, problemCount)}>
        Training starten
      </button>
    </div>
  );
}
