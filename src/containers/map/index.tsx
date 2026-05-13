import { useState } from "react";
import DifficultySelector from "./DifficultySelector";
import "./index.less";
import type { Difficulty } from ".";
import PuzzleGame from "./game";

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const handleSelectDifficulty = (selected: Difficulty) => {
    setDifficulty(selected);
  };

  const handleChangeDifficulty = () => {
    setDifficulty(null);
  };

  return (
    <div className="map-game">
      {!difficulty ? (
        <DifficultySelector onSelect={handleSelectDifficulty} />
      ) : (
        <PuzzleGame
          difficulty={difficulty}
          onChangeDifficulty={handleChangeDifficulty}
        />
      )}
    </div>
  );
}

export default App;
