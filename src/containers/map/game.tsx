import React, { useState, useEffect, useRef } from "react";
import type { PuzzlePiece, Difficulty } from "./index.ts";
import {
  generatePuzzlePieces,
  shufflePieces,
  swapPieces,
  checkWin,
  cropImageToPiece
} from "./utils";
import VictoryModal from "./VictoryModal";
import "./game.less";
import img1Url from "./img1.jpg";
import img2Url from "./img2.jpg";

interface Props {
  difficulty: Difficulty;
  onChangeDifficulty: () => void;
}

const LOCAL_IMAGES = {
  3: img1Url,
  4: img2Url
};

const PuzzleGame: React.FC<Props> = ({ difficulty, onChangeDifficulty }) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [steps, setSteps] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showCheatModal, setShowCheatModal] = useState(false);
  const [cheatReward, setCheatReward] = useState<string | null>(null);

  const timerRef = useRef<any>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // 加载并裁剪图片
  useEffect(() => {
    const loadImage = async () => {
      const imageUrl = LOCAL_IMAGES[difficulty];
      console.log("加载本地图片:", imageUrl);

      const img = new Image();

      img.onload = async () => {
        console.log("图片加载成功，尺寸:", img.width, img.height);
        imgRef.current = img;
        const urls = await Promise.all(
          Array(difficulty * difficulty)
            .fill(0)
            .map((_, i) => cropImageToPiece(img, i, difficulty))
        );
        console.log("图片裁剪完成");
        setImageUrls(urls);
        setImageLoaded(true);
      };

      img.onerror = (error) => {
        console.error("图片加载失败:", error);
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
    setCheatReward(null);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
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
        timerRef.current = null;
      }
    };
  }, [gameStarted, isWin]);

  // 检查胜利
  useEffect(() => {
    if (gameStarted && pieces.length > 0 && checkWin(pieces)) {
      setIsWin(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
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

  // 作弊功能
  const handleCheat = () => {
    if (isWin) {
      setCheatReward("🎉 已经赢了！别再作弊啦~");
      setTimeout(() => setCheatReward(null), 2000);
      return;
    }
    setShowCheatModal(true);
  };

  // 一键通关：直接完成拼图
  const completePuzzle = () => {
    // 直接生成正确顺序的拼图
    const total = difficulty * difficulty;
    const correctPieces: PuzzlePiece[] = [];

    for (let i = 0; i < total; i++) {
      correctPieces.push({
        id: i,
        currentPos: i,
        correctPos: i,
        isBlank: i === total - 1
      });
    }

    setPieces(correctPieces);
    setCheatReward("😘 收到亲亲！作弊成功！拼图已完成，通关啦！🎉");

    setTimeout(() => {
      setCheatReward(null);
    }, 3000);
  };

  // 确认作弊（亲一口奖励）
  const confirmCheat = () => {
    setShowCheatModal(false);
    completePuzzle(); // 直接通关
  };

  // 取消作弊
  const cancelCheat = () => {
    setShowCheatModal(false);
  };

  // 获取拼图块的背景样式
  const getPieceStyle = (piece: PuzzlePiece) => {
    if (piece.isBlank) {
      return { background: "#2d3748" };
    }

    const imgUrl = imageUrls[piece.correctPos];
    if (!imgUrl) {
      return { background: "#667eea" };
    }

    return {
      backgroundImage: `url(${imgUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
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
            <button className="btn-cheat" onClick={handleCheat}>
              🙋‍♂️ 报告！我要作弊
            </button>
            <button className="btn-restart" onClick={handleRestart}>
              🔄 重新开始
            </button>
            <button className="btn-change" onClick={onChangeDifficulty}>
              🏠 切换难度
            </button>
          </div>
        </div>

        {cheatReward && <div className="cheat-reward">{cheatReward}</div>}

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
              className={`puzzle-piece ${piece.isBlank ? "blank" : ""}`}
              style={getPieceStyle(piece)}
              onClick={() => handlePieceClick(piece.currentPos)}
            >
              {piece.isBlank && <span className="blank-icon">❤️</span>}
            </div>
          ))}
        </div>

        <div className="game-info">
          <p className="tip">💡 提示：点击相邻的拼图块进行移动</p>
        </div>
      </div>

      {/* 作弊弹窗 */}
      {showCheatModal && (
        <div className="cheat-modal-overlay" onClick={cancelCheat}>
          <div className="cheat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cheat-modal-icon">😘</div>
            <h3 className="cheat-modal-title">想要作弊？</h3>
            <p className="cheat-modal-text">
              抽牌5张做完全部惩罚，才能帮你通关！
              <br />
              <span className="cheat-modal-reward">🎁 奖励：一键完成拼图</span>
            </p>
            <div className="cheat-modal-buttons">
              <button className="cheat-modal-confirm" onClick={confirmCheat}>
                💋 我要作弊！
              </button>
              <button className="cheat-modal-cancel" onClick={cancelCheat}>
                姐是高智商
              </button>
            </div>
          </div>
        </div>
      )}

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
