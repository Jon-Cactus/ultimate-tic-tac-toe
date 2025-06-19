import type { GameState } from '../interfaces';
import { calculateWinner } from './helpers';

// Validate moves
export function validateMove(
    state: GameState,
    subBoardIdx: number,
    squareIdx: number,
    player: string
  ): boolean {
    const { history, currentMove, activeSubBoard, startingPlayer } = state;
    const currentBoard = history[currentMove]; // Retrieve current snapshot

    const { gameWinner, subBoardWinners } = calculateWinner(currentBoard)
    if (history === undefined) return false;
    
    const turn = currentMove % 2 === 0 ? startingPlayer : (startingPlayer === 'X' ? 'O' : 'X');
    if (player !== turn || // Blocks moves when it is not the player's turn
        currentBoard[subBoardIdx][squareIdx] || // Blocks moves on filled squares
        subBoardWinners[subBoardIdx] || // Blocks moves on subboards that have been won
        gameWinner) return false; // Block moves when the game has been won
    //if (subBoardWinners[subBoardIdx]) return; // Block moves on won subboards
    if (activeSubBoard !== null && subBoardIdx !== activeSubBoard) return false; // Block moves on non-active subboards
    return true;
}