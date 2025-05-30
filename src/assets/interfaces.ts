export interface MetaBoardProps {
    xIsNext: boolean;
    metaBoard: (string | null)[][];
    onPlay: (nextSquares: (string | null)[][]) => void;
    subBoardWinners: (number[] | null);
    status: (string | null);
}

export interface SubBoardProps {
}

export interface SquareProps {
    value: (string | null);
    onSquareClick: () => void;
    isWon: (boolean | undefined);
}