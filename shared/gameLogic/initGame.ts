import type { GameState } from '../interfaces';

const emptySubBoard = Array(9).fill(null);
const emptyBoard = Array(9).fill(null).map(() => [...emptySubBoard]);

// Initialize a new game
export function initGame(): GameState {
    return {
        history: [emptyBoard],
        currentMove: 0,
        activeSubBoard: null,
        startingPlayer: Math.random() < 0.5 ? 'X' : 'O'
    };    
}