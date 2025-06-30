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
    if (!currentBoard) {
        throw new Error('Could not find current board in history.');
    }
    // Create deep copy
    const nextBoard: Board = currentBoard.map(subBoard => [...subBoard]);
    const targetedSubBoard = nextBoard[subBoardIdx];
    if (!targetedSubBoard) { // Make TypeScript happy
        throw new Error(`Invalid move: sub board index ${subBoardIdx} is out of bounds`);
    }
    // Place move
    targetedSubBoard[squareIdx] = player;
    // Append to history
    const nextHistory = [...history, nextBoard];
    const nextMove = nextHistory.length - 1;
    // Calculate winners
    const { subBoardWinners } = calculateWinner(nextBoard)
    // Determine next active subboard
    const winnerOfNextSubBoard = subBoardWinners[squareIdx];
    const nextActive = winnerOfNextSubBoard !== null ? null : squareIdx;

    return {
        history: nextHistory,
        currentMove: nextMove,
        activeSubBoard: nextActive,
        startingPlayer: state.startingPlayer
    }
}