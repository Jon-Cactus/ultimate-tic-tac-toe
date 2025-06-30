import { useState } from 'react';
import { calculateWinner, getMoveCoordinates } from '../../shared/gameLogic/helpers.js';
import { initGame, validateMove, applyMove } from '../../shared/gameLogic/index.js';
import type { GameState, Player } from '../../shared/interfaces.js';

export function useGameLogic() {
    // Learned through ChatGPT that a function can be passed into useState. This is convenient in
    // this case due to the fact that `initGame` returns values that change throughout the game, meaning
    // they can be easily updated or even reset.
    const [gameState, setGameState] = useState<GameState>(initGame()); 
    const syncState = (next: GameState) => setGameState(next);
    
    // Restart or begin game
    const handleFirstMoveSelection = () => setGameState(initGame());
    // Determine validity of potential move
    const isValidMove = (subBoardIdx: number, squareIdx: number, player: Player | null) =>
      validateMove(gameState, subBoardIdx, squareIdx, player);
    
    // execute moves when valid
    function handleMove(subBoardIdx: number, squareIdx: number, player: Player): undefined {
      if (!isValidMove(subBoardIdx, squareIdx, player)) return;
      const nextBoard = applyMove(gameState, subBoardIdx, squareIdx, player);
      console.log(nextBoard);
      setGameState(nextBoard);
    }
      
    const currentBoard = gameState.history[gameState.currentMove];
    const { gameWinner, subBoardWinners } = calculateWinner(currentBoard);
    const xIsNext = (gameState.currentMove % 2 === 0) ? (gameState.startingPlayer === 'X') : (gameState.startingPlayer !== 'X');

    return {
        // Game state
        history: gameState.history,
        currentMove: gameState.currentMove,
        activeSubBoard: gameState.activeSubBoard,
        startingPlayer: gameState.startingPlayer,
        xIsNext,
        currentBoard,
        gameWinner,
        subBoardWinners,
        // Actions
        isValidMove,
        handleFirstMoveSelection,
        handleMove,
        getMoveCoordinates,
        syncState
    };
} 
