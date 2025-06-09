export interface BoardProps {
    boards: (string | null)[][];
    activeSubBoard: number | null;
    onSquareClick: (idx: number, squareIdx: number) => void;
    subBoardWinners: (string | null)[];
}

export interface SubBoardProps {
    squares: (string | null)[];
    onSquareClick: (squareIdx: number) => void;
    isActive: (boolean | null);
    isWon: (string | null);
}

export interface SquareProps {
    value: (string | null);
    onSquareClick: () => void;
    active: string;
}

export interface HistoryListProps {
    history: ('X' | 'O' | null)[][][];
    startingPlayer: ('X' | 'O' | null);
    currentMove: number;
    gameWinner: (string | null);
    getMoveCoordinates: (prevBoard: ('X' | 'O' | null)[][], currentBoard: ('X' | 'O' | null)[][]) => number[] | null;
}

export interface StatusBarProps {
    gameWinner: (string | null);
    xIsNext: boolean;
    gameStarted: boolean;
}