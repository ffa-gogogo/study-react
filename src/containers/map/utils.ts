import type { PuzzlePiece } from "./index.ts";

// 生成拼图数据
export const generatePuzzlePieces = (gridSize: 3 | 4): PuzzlePiece[] => {
  const total = gridSize * gridSize;
  const pieces: PuzzlePiece[] = [];

  for (let i = 0; i < total; i++) {
    pieces.push({
      id: i,
      currentPos: i,
      correctPos: i,
      isBlank: i === total - 1 // 最后一块为空白
    });
  }

  return pieces;
};

// 打乱拼图（保证有解）
export const shufflePieces = (
  pieces: PuzzlePiece[],
  gridSize: 3 | 4
): PuzzlePiece[] => {
  let shuffled = [...pieces];
  let blankIndex = shuffled.findIndex((p) => p.isBlank);

  // 随机移动多次来打乱
  const moves = 200;
  for (let i = 0; i < moves; i++) {
    const neighbors = getMovableNeighbors(blankIndex, gridSize);
    if (neighbors.length > 0) {
      const randomNeighbor =
        neighbors[Math.floor(Math.random() * neighbors.length)];
      shuffled = swapPieces(shuffled, blankIndex, randomNeighbor);
      blankIndex = randomNeighbor;
    }
  }

  // 检查是否有解，如果无解则交换最后两块
  if (!isSolvable(shuffled, gridSize)) {
    const lastIndex = gridSize * gridSize - 1;
    const secondLastIndex = lastIndex - 1;
    shuffled = swapPieces(shuffled, lastIndex, secondLastIndex);
  }

  return shuffled;
};

// 获取可移动的邻居位置
const getMovableNeighbors = (blankPos: number, gridSize: number): number[] => {
  const neighbors: number[] = [];
  const row = Math.floor(blankPos / gridSize);
  const col = blankPos % gridSize;

  // 上
  if (row > 0) neighbors.push(blankPos - gridSize);
  // 下
  if (row < gridSize - 1) neighbors.push(blankPos + gridSize);
  // 左
  if (col > 0) neighbors.push(blankPos - 1);
  // 右
  if (col < gridSize - 1) neighbors.push(blankPos + 1);

  return neighbors;
};

// 交换两个位置
export const swapPieces = (
  pieces: PuzzlePiece[],
  pos1: number,
  pos2: number
): PuzzlePiece[] => {
  const newPieces = [...pieces];
  const temp = { ...newPieces[pos1] };
  newPieces[pos1] = { ...newPieces[pos2], currentPos: pos1 };
  newPieces[pos2] = { ...temp, currentPos: pos2 };
  return newPieces;
};

// 检查是否胜利
export const checkWin = (pieces: PuzzlePiece[]): boolean => {
  return pieces.every((piece) => piece.currentPos === piece.correctPos);
};

// 检查是否有解（3x3需要逆序数为偶数，4x4需要考虑空白行）
const isSolvable = (pieces: PuzzlePiece[], gridSize: 3 | 4): boolean => {
  const flatPieces = pieces.filter((p) => !p.isBlank).map((p) => p.correctPos);

  let inversions = 0;
  for (let i = 0; i < flatPieces.length; i++) {
    for (let j = i + 1; j < flatPieces.length; j++) {
      if (flatPieces[i] > flatPieces[j]) inversions++;
    }
  }

  if (gridSize === 3) {
    return inversions % 2 === 0;
  } else {
    const blankRow = Math.floor(
      pieces.find((p) => p.isBlank)!.currentPos / gridSize
    );
    // 4x4：逆序数 + 空白行从底部算起的行数 需要为偶数
    return (inversions + (gridSize - blankRow)) % 2 === 0;
  }
};

// 裁剪图片
export const cropImageToPiece = (
  img: HTMLImageElement,
  pieceIndex: number,
  gridSize: number
): Promise<string> => {
  return new Promise((resolve) => {
    const pieceWidth = img.width / gridSize;
    const pieceHeight = img.height / gridSize;
    const row = Math.floor(pieceIndex / gridSize);
    const col = pieceIndex % gridSize;

    const canvas = document.createElement("canvas");
    canvas.width = pieceWidth;
    canvas.height = pieceHeight;
    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(
      img,
      col * pieceWidth,
      row * pieceHeight,
      pieceWidth,
      pieceHeight,
      0,
      0,
      pieceWidth,
      pieceHeight
    );

    resolve(canvas.toDataURL());
  });
};
