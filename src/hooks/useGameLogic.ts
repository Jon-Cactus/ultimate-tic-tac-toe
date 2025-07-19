import { useState, useMemo, useCallback } from 'react';
import { calculateWinner, getMoveCoordinates } from '../../shared/gameLogic/helpers.js';
import { initGame, validateMove, applyMove } from '../../shared/gameLogic/index.js';
import type { GameState, Board, Player } from '../../shared/interfaces.js';

// Fallback empty board to address race condition
const emptyBoard: Board = Array(9).fill(null).map(() => Array(9).fill(null))

export function useGameLogic() {

    const [gameState, setGameState] = useState<GameState>(initGame()); 
    const syncState = (next: GameState) => setGameState(next);
    
    // Restart or begin game
    const handleFirstMoveSelection = useCallback(() => setGameState(initGame()), []);
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
      
    const currentBoard = gameState.history[gameState.currentMove].board || emptyBoard;

    const { gameWinner, subBoardWinners } = useMemo(() => {
      return calculateWinner(currentBoard);
    }, [currentBoard]);

    const xIsNext = (gameState.currentMove % 2 === 0) ? (gameState.startingPlayer === 'X') : (gameState.startingPlayer !== 'X');

    return {
        // Game state
        history: gameState.history,
        currentMove: gameState.currentMove,
        activeSubBoard: gameState.activeSubBoard,
        currentPlayer: gameState.currentPlayer,
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
