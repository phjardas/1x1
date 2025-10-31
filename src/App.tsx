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
  const [state, setState] = useState<GameState>({ state: "setup" });

  const startGame = useCallback(
    (spec: ProblemSpec, problemCount: number) => {
      if (state.state !== "setup") return;
      const game = new Game(spec, problemCount);
      setState({ state: "running", game });
    },
    [state]
  );

  return (
    <div className="max-w-md mx-auto pt-10 md:pt-20 px-4 sm:px-0">
      <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-white/50">
        {state.state === "setup" && <Setup startGame={startGame} />}
        {state.state === "running" && (
          <GameRunning
            game={state.game}
            onGameEnd={(result) => setState({ state: "ended", result })}
          />
        )}
        {state.state === "ended" && (
          <GameFinished
            result={state.result}
            resetGame={() => setState({ state: "setup" })}
          />
        )}
      </div>
    </div>
  );
}
