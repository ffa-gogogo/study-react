export interface PuzzlePiece {
  id: number;
  currentPos: number;
  correctPos: number;
  isBlank: boolean;
}

export interface GameConfig {
  gridSize: 3 | 4;
  imageSrc: string;
}

export type Difficulty = 3 | 4;
