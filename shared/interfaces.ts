import type { Socket } from 'socket.io-client';

export type Player = 'X' | 'O';
export type Cell = Player | null;
export type SubBoard = Cell[];
export type Board = SubBoard[];

// Props
export interface GameProps {
    history: Board[];
    currentMove: number;
    activeSubBoard: number | null;
    currentBoard: Board;
    startingPlayer: Player | null;
    xIsNext: boolean;
    gameWinner: string | null;
    subBoardWinners: (string | null)[];
    onSquareClick: (subBoardIdx: number, squareIdx: number) => void;

    // Optional: game reset/online play
    resetBoard?: () => void;
    requestReset?: () => void;
    resetRequested?: boolean;
    iSentRequest?: boolean;
    // Optional: multiplayer mode
    isHost?: boolean | undefined;
    guestJoined?: boolean;
    roomId?: string | undefined;
}

export interface BoardProps {
    boards: Board;
    activeSubBoard: number | null;
    onSquareClick: ((subBoardIdx: number, squareIdx: number) => void);
    subBoardWinners: (string | null)[];
}

export interface SubBoardProps {
    squares: SubBoard;
    onSquareClick: (squareIdx: number) => void;
    isActive: boolean | null;
    isWon: string | null;
}

export interface SquareProps {
    value: Player | null;
    onSquareClick: () => void;
    active: string;
}

export interface HistoryListProps {
    history: Board[];
    startingPlayer: (Player | null);
    currentMove: number;
    gameWinner: string | null;
}

export interface StatusBarProps {
    gameWinner: string | null;
    xIsNext: boolean;
    shareRoomId?: string;
    waitingForGuest?: boolean;
    isHost: boolean | undefined;
    guestJoined: boolean | undefined;
    roomId: string | undefined;
}

export interface OnlineGameProps {
    roomId: string | undefined;
    socket: Socket;
    isHost: boolean;
    guestJoined: boolean;
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