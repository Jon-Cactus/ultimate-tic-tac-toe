import { calculateWinner } from './helpers.js';
import type { GameState, Board, Player } from '../interfaces.js';

export function applyMove(
    state: GameState,
    subBoardIdx: number,
    squareIdx: number,
    player: Player,
): GameState {
    const history = state.history.slice(0, state.currentMove + 1);
    const currentBoard = history[state.currentMove];
    // Create deep copy
    const nextBoard: Board = currentBoard.map(subBoard => [...subBoard]);
    // Place move
    nextBoard[subBoardIdx][squareIdx] = player;
    // Append to history
    const nextHistory = [...history, nextBoard];
    const nextMove = nextHistory.length - 1;
    // Calculate winners
    const { subBoardWinners } = calculateWinner(nextBoard)
    // Determine next active subboard
    const nextActive = subBoardWinners[squareIdx] !== null ? null : squareIdx;

    return {
        history: nextHistory,
        currentMove: nextMove,
        activeSubBoard: nextActive,
        startingPlayer: state.startingPlayer
    }
}