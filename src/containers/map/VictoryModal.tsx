import React from "react";
import "./VictoryModal.less";

interface Props {
  isOpen: boolean;
  steps: number;
  time: number;
  onRestart: () => void;
  onChangeDifficulty: () => void;
}

const VictoryModal: React.FC<Props> = ({
  isOpen,
  steps,
  time,
  onRestart,
  onChangeDifficulty
}) => {
  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="victory-modal">
      <div className="modal-content">
        <h2>
          🎉 你太棒了 🎉 <br /> 奖励生日礼物一个！
        </h2>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">步数</span>
            <span className="stat-value">{steps}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">时间</span>
            <span className="stat-value">{formatTime(time)}</span>
          </div>
        </div>
        <div className="buttons">
          <button className="btn restart" onClick={onRestart}>
            再来一局
          </button>
          <button className="btn change" onClick={onChangeDifficulty}>
            切换难度
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryModal;
