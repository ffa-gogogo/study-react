import React, { useState, useEffect, useRef } from "react";
import type { PuzzlePiece, Difficulty } from "./index.ts";
import {
  generatePuzzlePieces,
  shufflePieces,
  swapPieces,
  checkWin,
  cropImageToPiece
} from "./utils";
import { GAME_IMAGES } from "./images";
import VictoryModal from "./VictoryModal";
import "./index.less";
import img1 from "./img1.jpg";
import img2 from "./img2.jpg";
interface Props {
  difficulty: Difficulty;
  onChangeDifficulty: () => void;
}

const PuzzleGame: React.FC<Props> = ({ difficulty, onChangeDifficulty }) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [steps, setSteps] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const timerRef = useRef<any>(null); // 修复：提供初始值 null
  const imgRef = useRef<HTMLImageElement | null>(null);

  // 加载并裁剪图片
  useEffect(() => {
    const loadImage = async () => {
      const imageUrl = GAME_IMAGES[difficulty];
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = async () => {
        imgRef.current = img;
        const urls = await Promise.all(
          Array(difficulty * difficulty)
            .fill(0)
            .map((_, i) => cropImageToPiece(img, i, difficulty))
        );
        setImageUrls(urls);
        setImageLoaded(true);
      };

      img.src = imageUrl;
    };

    loadImage();
  }, [difficulty]);

  // 初始化游戏
  useEffect(() => {
    if (imageLoaded) {
      initGame();
    }
  }, [imageLoaded]);

  const initGame = () => {
    const newPieces = generatePuzzlePieces(difficulty);
    const shuffled = shufflePieces(newPieces, difficulty);
    setPieces(shuffled);
    setSteps(0);
    setTime(0);
    setIsWin(false);
    setGameStarted(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // 计时器
  useEffect(() => {
    if (gameStarted && !isWin) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, isWin]);

  // 检查胜利
  useEffect(() => {
    if (gameStarted && pieces.length > 0 && checkWin(pieces)) {
      setIsWin(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [pieces, gameStarted]);

  // 移动拼图
  const handlePieceClick = (clickedPos: number) => {
    if (isWin || !gameStarted) return;

    const blankPiece = pieces.find((p) => p.isBlank);
    if (!blankPiece) return;

    const blankPos = blankPiece.currentPos;
    const isAdjacent = checkAdjacent(blankPos, clickedPos, difficulty);

    if (isAdjacent) {
      const newPieces = swapPieces(pieces, blankPos, clickedPos);
      setPieces(newPieces);
      setSteps((prev) => prev + 1);
    }
  };

  // 检查是否相邻
  const checkAdjacent = (
    pos1: number,
    pos2: number,
    gridSize: number
  ): boolean => {
    const row1 = Math.floor(pos1 / gridSize);
    const col1 = pos1 % gridSize;
    const row2 = Math.floor(pos2 / gridSize);
    const col2 = pos2 % gridSize;

    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
  };

  // 重新开始
  const handleRestart = () => {
    initGame();
  };

  // 获取拼图块的背景样式
  const getPieceStyle = (piece: PuzzlePiece) => {
    if (piece.isBlank) {
      return { background: "#2d3748" };
    }

    const imgUrl = imageUrls[piece.correctPos];
    return {
      backgroundImage: `url(${imgUrl})`,
      backgroundSize: `${difficulty * 100}%`,
      backgroundPosition: `${(piece.currentPos % difficulty) * (100 / (difficulty - 1))}% ${Math.floor(piece.currentPos / difficulty) * (100 / (difficulty - 1))}%`
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!imageLoaded) {
    return (
      <div className="puzzle-game loading">
        <div className="loader"></div>
        <p>加载图片中...</p>
      </div>
    );
  }

  return (
    <div className="puzzle-game">
      <div className="game-container">
        <div className="game-header">
          <div className="stats">
            <div className="stat">
              <span className="stat-label">步数</span>
              <span className="stat-value">{steps}</span>
            </div>
            <div className="stat">
              <span className="stat-label">时间</span>
              <span className="stat-value">{formatTime(time)}</span>
            </div>
          </div>
          <div className="controls">
            <button className="btn-restart" onClick={handleRestart}>
              🔄 重新开始
            </button>
            <button className="btn-change" onClick={onChangeDifficulty}>
              🏠 切换难度
            </button>
          </div>
        </div>

        <div
          className="puzzle-grid"
          style={{
            gridTemplateColumns: `repeat(${difficulty}, 1fr)`,
            width: "min(80vw, 80vh, 600px)",
            height: "min(80vw, 80vh, 600px)"
          }}
        >
          {pieces.map((piece) => (
            <div
              key={piece.id}
              className={`puzzle-piece ${piece.isBlank ? "blank" : ""} ${checkWin(pieces) ? "win" : ""}`}
              style={getPieceStyle(piece)}
              onClick={() => handlePieceClick(piece.currentPos)}
            >
              {piece.isBlank && <span className="blank-icon">◻️</span>}
            </div>
          ))}
        </div>

        <div className="game-info">
          <p className="tip">💡 提示：点击相邻的拼图块进行移动</p>
        </div>
      </div>

      <VictoryModal
        isOpen={isWin}
        steps={steps}
        time={time}
        onRestart={handleRestart}
        onChangeDifficulty={onChangeDifficulty}
      />
    </div>
  );
};

export default PuzzleGame;
