export interface SubBoardProps {
    xIsNext: boolean;
    squares: (string | null)[];
    onPlay: (nextSquares: (string | null)[]) => void;
}

export interface SquareProps {
    value: (string | null);
    onSquareClick: () => void;
}