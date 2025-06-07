import { useState } from 'react';
import { calculateWinner } from '../utils/helpers';
import Board from './Board';
import '../App.css';

export default function Game() {
  // Array of meta-boards, each entry being a 9x9 array of either null or X or O
  const [history, setHistory] = useState<('X' | 'O' | null)[][][]>([
    Array(9).fill(null).map(() => Array(9).fill(null))
  ]);
  const [currentMove, setCurrentMove] = useState<number>(0); // Save move number
  const [isActive, setIsActive] = useState<number | null>(null); // Save active board index
  const [startingPlayer, setStartingPlayer] = useState<'X' | 'O' | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const currentBoards = history[currentMove]; // Current snapshot of the board
  // Determine which player is next
  let xIsNext = true;
  if (startingPlayer !== null) {
    if (startingPlayer === 'X') {
      xIsNext = currentMove % 2 === 0;
    } else {
      xIsNext = currentMove % 2 === 1;
    }
  }
  // Check for winner
  const { gameWinner, subBoardWinners } = calculateWinner(currentBoards);
  // Randomly determine if X or O moves first and set board to active
  function handleFirstMoveSelection() {
    setStartingPlayer(Math.random() < 0.5 ? 'X' : 'O');
    setGameStarted(true);

    // Reset the board
    const emptyBoard = Array(9).fill(null).map(() => Array(9).fill(null));
    setHistory([emptyBoard]);
    setIsActive(null);
    setCurrentMove(0);
  }
  
  function handleMove(subBoardIdx: number, squareIdx: number): void {
    const currentSubBoard = currentBoards[subBoardIdx];
    if (currentSubBoard[squareIdx] || // Blocks moves on filled squares
      subBoardWinners[subBoardIdx] || // Blocks moves on subboards that have been won
      gameStarted === false || // Blocks moves when the game hasn't been started
      gameWinner) return; // Block moves when the game has been won
    //if (subBoardWinners[subBoardIdx]) return; // Block moves on won subboards
    if (isActive !== null && subBoardIdx !== isActive) return; // Block moves on non-active subboards

    const nextSubBoard = [...currentSubBoard];
    nextSubBoard[squareIdx] = xIsNext ? 'X' : 'O';

    const nextBoards = [...currentBoards];
    nextBoards[subBoardIdx] = nextSubBoard;
    // Grab updated winning boards based on new board state
    const { subBoardWinners: nextSubBoardWinners } = calculateWinner(nextBoards);
    // Update game state
    const nextHistory = [...history.slice(0, currentMove + 1), nextBoards];
    // Appends a new array based on the latest move
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    // Determine which subboards are okay to move in
    if (nextSubBoardWinners[squareIdx]) {
      setIsActive(null); // Allow any subboard in cases when won or full
    } else {
      setIsActive(squareIdx); 
    }
  }

  function jumpTo(nextMove: number): void {
    setCurrentMove(nextMove);
    const nextHistory = [...history.slice(0, nextMove + 1)];
    setHistory(nextHistory);
  }

  // TODO: Still needed?
  let status;
  if (gameWinner) {
    status = 'Winner: ' + gameWinner;
  } else {
    status = gameStarted ? 'Next player: ' + (xIsNext ? 'X' : 'O') : 'Click button below to start game!';
  }

  // Determine contents of the game control button
  const gameControlContent = <button className="btn-base" onClick={() => handleFirstMoveSelection()}>
    {!startingPlayer && !gameStarted ? 'Who goes first?' : 'Restart Game'}
    </button>;



  return (
      <div className="game">
        <div className="board-container">
          <div className="status">{status}</div>
          <Board 
            boards={currentBoards}
            activeSubBoard={isActive}
            onSquareClick={handleMove}
            subBoardWinners={subBoardWinners}
          />
          <div className="game-control">
            {gameControlContent}
          </div>
        </div>
        <div className="game-info">
          <div className="current-move">Move #{`${currentMove + 1}`}</div>
          <ol>{moves}</ol>
        </div>
      </div>
  );
}