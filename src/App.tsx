import { useState } from 'react';
import type {SubBoardProps, SquareProps} from './assets/interfaces';
import { calculateWinner, getMoveCoordinates } from './utils/helpers';
import './App.css';

function Square({ value, onSquareClick, isWon }: SquareProps) {
  return (
    <button
    className={`square ${isWon ? 'won' : ''}`}
    onClick={onSquareClick}>
      {value}
    </button>
  )
}

function SubBoard({ xIsNext, squares, onPlay, winningSquares, status }: SubBoardProps) {
  function handleClick(i: number) {
    // Return early if square already filled or someone has won
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice(); // Create copy of the squares array
    // Determine which player is next
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  return (
  <>
    <div className="status">{status}</div>
    {Array.from({length: 3}, (_, row) => (
      <div className="sub-board-row" key={row}>
        {Array.from({length: 3}, (_, col) => {
          const index = row * 3 + col;
          const isWon = winningSquares?.includes(index);
          return (
            <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
            isWon={isWon}
            />
          )
        })}
      </div>
    ))}
  </> 
  )
}

export default function Game() {
  const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  // Current snapshot of the board
  const currentSquares = history[currentMove];
  // Determine which player is next
  const xIsNext = (currentMove % 2 === 0);
  // Check for winner
  const winningSquares = calculateWinner(currentSquares);

  function handlePlay(nextSquares: (string | null)[]): void {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    // Appends a new array based on the latest move
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number): void {
    setCurrentMove(nextMove);
    const nextHistory = [...history.slice(0, nextMove + 1)];
    setHistory(nextHistory);
  }

  let status;
  if (winningSquares) {
    const winner = currentSquares[winningSquares[0]];
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  if (currentSquares.includes(null) === false && !winningSquares) {
    status = 'Tie!';
  }

  // Create move list
  const moves = history.map((squares, move) => {
    const isCurrentMove = move === history.length - 1;
    const player = (move % 2 === 0) ? 'O' : 'X';
    const prevSquares = move > 0 ? history[move - 1] : undefined;
    const moveCoordinates = getMoveCoordinates(prevSquares, squares);
      // Determine the correct description based on current move and move #
    const description = (isCurrentMove && history.length > 9)
      ? 'No more legal moves!'
      : isCurrentMove
      ? `Currently on move #${move + 1}`
      : move > 0 && moveCoordinates
      ? `Go to move #${move} (${player} on ${moveCoordinates[0]}, ${moveCoordinates[1]})`
      : 'Go to game start';
    // Determine whether the li should be rendered as a paragraph or button based on currentMove
    return (
      <li key={move}>
        {isCurrentMove ? (
          <p>{description}</p>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="board">
        <SubBoard
        xIsNext={xIsNext}
        squares={currentSquares}
        onPlay={handlePlay}
        winningSquares={winningSquares}
        status={status}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

