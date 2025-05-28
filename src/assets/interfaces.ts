export interface SubBoardProps {
    xIsNext: boolean;
    squares: (string | null)[];
    onPlay: (nextSquares: (string | null)[]) => void;
    winningSquares: (number[] | null);
}

export interface SquareProps {
    value: (string | null);
    onSquareClick: () => void;
    isWon: (boolean | undefined);
}