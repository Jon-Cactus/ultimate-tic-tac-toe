export interface SubBoardProps {
    subBoardIdx: number;
    squares: (string | null)[];
    onSquareClick: (squareIdx: number) => void;
}

export interface SquareProps {
    value: (string | null);
    onSquareClick: () => void;
}