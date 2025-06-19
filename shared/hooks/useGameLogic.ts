import { useState } from 'react';
import { calculateWinner, getMoveCoordinates } from '../gameLogic/helpers';
import { initGame } from '../gameLogic/initGame'
import { validateMove } from '../gameLogic/validateMove';
import { applyMove } from '../gameLogic/applyMove';
import type { GameState, Player } from '../interfaces';

export function useGameLogic() {
    const [gameState, setGameState] = useState<GameState>(initGame());
    
    // Restart or begin game
    const handleFirstMoveSelection = () => setGameState(initGame());
    // Determine validity of potential move
    const isValidMove = (subBoardIdx: number, squareIdx: number, player: Player) =>
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
        //
        currentBoard,
        gameWinner,
        subBoardWinners,
        // Actions
        isValidMove,
        handleFirstMoveSelection,
        handleMove,
        getMoveCoordinates,
    };
} 
