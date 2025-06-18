import { calculateWinner } from './helpers';
import { GameState, Board } from '../interfaces';

export function applyMove(
    state: GameState,
    subBoardIdx: number,
    squareIdx: number,
    player: string
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
    const { gameWinner, subBoardWinners } = calculateWinner(nextBoard)
    // Determine next active subboard
    const nextActive = subBoardWinners[squareIdx] !== null ? null : squareIdx;

    return {
        history: nextHistory,
        currentMove: nextMove,
        activeSubBoard: nextActive,
        startingPlayer: state.startingPlayer
    }
}