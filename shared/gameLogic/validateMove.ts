import type { GameState } from '../interfaces.js';
import { calculateWinner } from './helpers.js';

// Validate moves
export function validateMove(
    state: GameState,
    subBoardIdx: number,
    squareIdx: number,
    player: string | null
  ): boolean {
    const { history, currentMove, activeSubBoard, startingPlayer } = state;
    const currentBoard = history[currentMove]; // Retrieve current snapshot
    if (!currentBoard) {
      return false;
    }

    const { gameWinner, subBoardWinners } = calculateWinner(currentBoard)
    if (history === undefined) return false;
    if (gameWinner) return false; // Block moves when the game has been won
    
    const turn = currentMove % 2 === 0 ? startingPlayer : (startingPlayer === 'X' ? 'O' : 'X');
    if (player !== turn) return false // Blocks moves when it is not the player's turn

    const targetSubBoard = currentBoard[subBoardIdx]; // Make TypeScript happy
    const subBoardWinner = subBoardWinners[subBoardIdx];
    if (!targetSubBoard || subBoardWinner) return false; // Blocks moves on subboards that have been won
        
    if (targetSubBoard[squareIdx]) return false; // Blocks moves on filled squares
    // Block moves on non-active subboards
    if (activeSubBoard !== null && subBoardIdx !== activeSubBoard) return false; 
    
    return true;
}