import type { Socket } from 'socket.io-client';

export type Player = 'X' | 'O';
export type Cell = string | null;
export type SubBoard = Cell[];
export type Board = SubBoard[];

// Props
export interface GameProps {
    history: Board[];
    currentMove: number;
    activeSubBoard: number | null;
    currentBoards: SubBoard[];
    startingPlayer: Player | null;
    xIsNext: boolean;
    gameStarted: boolean;
    gameWinner: string | null;
    subBoardWinners: SubBoard[];
    onFirstMoveSelection: () => void;
    onSquareClick: (subBoardIdx: number, squareIdx: number) => void;
    getMoveCoordinates: (prevBoard: (string | null)[][], currBoard: (string | null)[][]) => number[] | null;
}

export interface BoardProps {
    boards: (string | null)[][];
    activeSubBoard: number | null;
    onSquareClick: (idx: number, squareIdx: number) => void;
    subBoardWinners: (string | null)[];
}

export interface SubBoardProps {
    squares: (string | null)[];
    onSquareClick: (squareIdx: number) => void;
    isActive: boolean | null;
    isWon: string | null;
}

export interface SquareProps {
    value: string | null;
    onSquareClick: () => void;
    active: string;
}

export interface HistoryListProps {
    history: ('X' | 'O' | null)[][][];
    startingPlayer: ('X' | 'O' | null);
    currentMove: number;
    gameWinner: string | null;
    getMoveCoordinates: (prevBoard: ('X' | 'O' | null)[][], currentBoard: ('X' | 'O' | null)[][]) => number[] | null;
}

export interface StatusBarProps {
    gameWinner: string | null;
    xIsNext: boolean;
    gameStarted: boolean;
}

export interface OnlineGameProps {
    roomId: string | undefined;
    socket: Socket;
    player: 'X' | 'O' | null;
}
// Server
export interface GameState {
    history: Board[];
    currentMove: number;
    activeSubBoard: number | null;
    startingPlayer: Player;
}

export interface MakeMove {
    roomId: string;
    subBoardIdx: number;
    squareIdx: number;
    player: Player;
}