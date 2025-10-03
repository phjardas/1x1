import { useCallback, useState } from "react";
import { Game, type GameResult } from "./game";
import GameFinished from "./GameFinished";
import { GameRunning } from "./GameRunning";
import { type ProblemSpec } from "./model";
import Setup from "./Setup";

type GameState =
  | { state: "setup" }
  | { state: "running"; game: Game }
  | { state: "ended"; result: GameResult };

export default function App() {
  const [state, setState] = useState<GameState>({
    state: "running",
    game: new Game(
      { operators: ["*"], minOperandValue: 0, maxOperandValue: 10 },
      10
    ),
  });

  const startGame = useCallback(
    (spec: ProblemSpec, problemCount: number) => {
      if (state.state !== "setup") return;
      const game = new Game(spec, problemCount);
      setState({ state: "running", game });
    },
    [state]
  );

  return (
    <div className="bg-slate-400 min-h-screen py-4 flex justify-center items-center">
      <div className="max-w-xs bg-slate-300 rounded-xl p-6 shadow-lg">
        {state.state === "setup" && <Setup startGame={startGame} />}
        {state.state === "running" && (
          <GameRunning
            game={state.game}
            onGameEnd={(result) => setState({ state: "ended", result })}
          />
        )}
        {state.state === "ended" && <GameFinished result={state.result} />}
      </div>
    </div>
  );
}
