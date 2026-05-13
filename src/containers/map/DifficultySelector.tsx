import React from "react";
import "./DifficultySelector.less";
import type { Difficulty } from ".";
interface Props {
  onSelect: (difficulty: Difficulty) => void;
}

const DifficultySelector: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="difficulty-selector">
      <div className="difficulty-container">
        <h1 className="title">拼图大冒险</h1>
        <p className="subtitle">选择游戏难度</p>
        <div className="buttons">
          <button className="btn btn-3x3" onClick={() => onSelect(3)}>
            <span className="btn-title">3 x 3</span>
            <span className="btn-desc">简单</span>
          </button>
          <button className="btn btn-4x4" onClick={() => onSelect(4)}>
            <span className="btn-title">4 x 4</span>
            <span className="btn-desc">困难</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DifficultySelector;
