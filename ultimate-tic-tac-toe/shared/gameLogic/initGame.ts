import type { GameState } from '../interfaces.js';

const emptySubBoard = Array(9).fill(null);
const emptyBoard = Array(9).fill(null).map(() => [...emptySubBoard]); // Spread for unique copies

// Initialize a new game with fresh state
export function initGame(): GameState {
    return {
        history: [emptyBoard],
        currentMove: 0,
        activeSubBoard: null,
        startingPlayer: Math.random() < 0.5 ? 'X' : 'O'
    };    
}