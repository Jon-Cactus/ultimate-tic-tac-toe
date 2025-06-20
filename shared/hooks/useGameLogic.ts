import { useState } from 'react';
import { calculateWinner, getMoveCoordinates } from '../gameLogic/helpers';
import { initGame, validateMove, applyMove } from '../gameLogic/';
import type { GameState, Player } from '../interfaces';

export function useGameLogic() {
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
        //
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
