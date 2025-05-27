import { useState } from 'react'
import type {SubBoardProps, SquareProps} from './assets/interfaces'
import './App.css'

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  )
}

function SubBoard({ xIsNext, squares, onPlay }: SubBoardProps) {
  function handleClick(i: number) {
    // Return early if square already filled or someone has won
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice(); // Create copy of the squares array
    // Determine which player is next
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
  <>
    <div className="status">{status}</div>
    {Array.from({length: 3}, (_, row) => (
      <div className="sub-board-row" key={row}>
        {Array.from({length: 3}, (_, col) => {
          const index = row * 3 + col;
          return (
            <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
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

  const moves = history.map((squares, move) => {
    let description = (move > 0) ? 'Go to move #' + move : 'Go to game start';
    if (move === history.length - 1) {
      description = `Currently on move #${move}`;
      return (
        <li key={move}>
          <p>{description}</p>
        </li>
      )
    }
    
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="board">
        <SubBoard xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares: (string | null)[])  {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  for (let i: number = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


