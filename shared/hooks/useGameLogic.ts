import { useState } from 'react';
import { calculateWinner, getMoveCoordinates } from '../gameLogic/helpers';
import { initGame } from '../gameLogic/initGame'
import { validateMove } from '../gameLogic/validateMove';
import { applyMove } from '../gameLogic/applyMove';
import type { GameState } from '../interfaces';

export function useGameLogic() {
    const [gameState, setGameState] = useState<GameState>(initGame());
    
    // Restart or begin game
    const handleFirstMoveSelection = () => setGameState(initGame());
    // Determine validity of potential move
    const isValidMove = (squareIdx: number, subBoardIdx: number, player: string) =>
      validateMove(gameState, subBoardIdx, squareIdx, player);
    
    // execute moves when valid
    function handleMove(subBoardIdx: number, squareIdx: number, player: string): void {
      if (!isValidMove(subBoardIdx, squareIdx, player)) return;
      const nextBoard = applyMove(gameState, subBoardIdx, squareIdx, player);
      setGameState(nextBoard);
    }
      
    const currentBoard = gameState.history[gameState.currentMove];
    const { gameWinner, subBoardWinners } = calculateWinner(currentBoard);

    return {
        // Game state
        history: gameState.history,
        currentMove: gameState.currentMove,
        activeSubBoard: gameState.activeSubBoard,
        startingPlayer: gameState.startingPlayer,
        //
        currentBoard,
        gameWinner,
        subBoardWinners,
        // Actions
        isValidMove,
        handleFirstMoveSelection,
        handleMove,
        getMoveCoordinates,
    }
} 
