export interface SubBoardProps {
    subBoardIdx: number;
    squares: (string | null)[];
    onSquareClick: (squareIdx: number) => void;
    isActive: (number | null);
    isWon: (string | null);
}

export interface SquareProps {
    value: (string | null);
    onSquareClick: () => void;
    active: string;
}