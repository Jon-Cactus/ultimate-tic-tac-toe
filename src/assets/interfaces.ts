export interface SmallBoardProps {
    xIsNext: boolean;
    squares: (string | null)[];
    onPlay: (nextSquares: (string | null)[]) => void;
}

export interface SquareProps {
    value: (string | null);
    onSquareClick: (handleClick: (number)) => void;
}