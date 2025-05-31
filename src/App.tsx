import { useState } from 'react';
import type {SubBoardProps, SquareProps} from './assets/interfaces';
import { calculateWinner, getMoveCoordinates } from './utils/helpers';
import './App.css';

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button
    className="square"
    onClick={onSquareClick}>
      {value}
    </button>
  )
}

function SubBoard({ subBoardIdx, squares, onSquareClick }: SubBoardProps) {

  return (
  <>
    {Array.from({length: 3}, (_, row) => (
      <div className="sub-board-row" key={row}>
        {Array.from({length: 3}, (_, col) => {
          const squareIdx = row * 3 + col;
          return (
            <Square
              key={squareIdx}
              value={squares[squareIdx]}
              onSquareClick={() => onSquareClick(squareIdx)}
            />
          )
        })}
      </div>
    ))}
  </> 
  )
}


export default function Game() {
  const [history, setHistory] = useState<(string | null)[][][]>([
    Array(9).fill(null).map(() => Array(9).fill(null))
  ]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  // Current snapshot of the board
  const currentBoards = history[currentMove];
  // Determine which player is next
  const xIsNext = (currentMove % 2 === 0);
  // Check for winner
  const { gameWinner, subBoardWinners } = calculateWinner(currentBoards);

  
  function handleMove(subBoardIdx: number, squareIdx: number): void {
    const currentSubBoard = currentBoards[subBoardIdx];
    if (currentSubBoard[squareIdx]) return;

    const nextSubBoard = [...currentSubBoard];
    nextSubBoard[squareIdx] = xIsNext ? 'X' : 'O';

    const nextBoards = [...currentBoards];
    nextBoards[subBoardIdx] = nextSubBoard;

    const nextHistory = [...history.slice(0, currentMove + 1), nextBoards];
    // Appends a new array based on the latest move
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
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
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // Create move list
  const moves = history.map((board, move) => {
    const isCurrentMove = move === history.length - 1;
    const player = (move % 2 === 0) ? 'O' : 'X';
    const prevBoard = move > 0 ? history[move - 1] : undefined;
    // TODO: Needs altering to account for the 3d arrays
    const moveCoordinates = getMoveCoordinates(prevBoard, board);
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
      <div className="meta-board">
        <div className="status">{status}</div>
        {Array.from({length: 3}, (_, row) => (
          <div className="meta-board-row" key={row}>
            {Array.from({length: 3}, (_, col) => {
              const subBoardIdx = row * 3 + col;
              return (
                <SubBoard
                  key={subBoardIdx}
                  subBoardIdx={subBoardIdx}
                  squares={currentBoards[subBoardIdx]}
                  onSquareClick={(squareIdx) => handleMove(subBoardIdx, squareIdx)}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}