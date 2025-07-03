import { calculateWinner } from './helpers.js';
import type { GameState, HistoryEntry, Board, Player } from '../interfaces.js';

export function applyMove(
    state: GameState,
    subBoardIdx: number,
    squareIdx: number,
    player: Player,
): GameState {
    const history = state.history.slice(0, state.currentMove + 1);
    const currentBoard = history[state.currentMove].board;
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
    
    // Calculate winners
    const { subBoardWinners } = calculateWinner(nextBoard)
    // Will the next subBoard be won?
    const nextSubBoardIsWon = subBoardWinners[squareIdx] !== null;
    // Determine next active subboard
    const nextActiveSubBoard = nextSubBoardIsWon ? null : squareIdx;

    const newHistoryEntry: HistoryEntry = {
        board: nextBoard,
        activeSubBoard: nextActiveSubBoard
    }
    // Append to history
    const nextHistory = [...history, newHistoryEntry];

    // Determine next player
    const nextPlayer = player === 'X' ? 'O' : 'X';

    return {
        history: nextHistory,
        currentMove: history.length,
        activeSubBoard: nextActiveSubBoard,
        startingPlayer: state.startingPlayer,
        currentPlayer: nextPlayer
    }
}