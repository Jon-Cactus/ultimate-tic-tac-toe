import { useState } from 'react';
import type {SubBoardProps, SquareProps} from './assets/interfaces';
import { calculateWinner, getMoveCoordinates } from './utils/helpers';
import './App.css';

function Square({ value, onSquareClick, active }: SquareProps) {
  const playerColor =
    value === 'X'
    ? 'player-1'
    : value === 'O'
    ? 'player-2'
    : ''
  return (
    <button
    className={`square ${playerColor} ${active}`}
    onClick={onSquareClick}>
      {value}
    </button>
  )
}

function SubBoard({ subBoardIdx, squares, onSquareClick, isActive, isWon }: SubBoardProps) {
  const playerColor =
    isWon === 'X'
    ? 'player-1 won'
    : isWon === 'O'
    ? 'player-2 won'
    : ''
  return (
  <>
    <div className={`sub-board ${playerColor}`}>{isWon !== 'draw' ? isWon : ''}
      {Array.from({length: 3}, (_, row) => (
        <div className={`sub-board-row ${isWon ? 'hidden' : ''}`} key={row}>
          {Array.from({length: 3}, (_, col) => {
            const squareIdx = row * 3 + col;
            return (
              <Square
                key={squareIdx}
                value={squares[squareIdx]}
                onSquareClick={() => onSquareClick(squareIdx)}
                active={subBoardIdx === isActive ? 'active' : ''}
              />
            )
          })}
        </div>
      ))}
    </div>
  </> 
  )
}

// TODO: need to restrict next move to the subBoardIdx of the last move's squareIdx
export default function Game() {
  const [history, setHistory] = useState<(string | null)[][][]>([
    Array(9).fill(null).map(() => Array(9).fill(null))
  ]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const [isActive, setIsActive] = useState<number | null>(null);
  // Current snapshot of the board
  const currentBoards = history[currentMove];
  // Determine which player is next
  const xIsNext = (currentMove % 2 === 0);
  // Check for winner
  const { gameWinner, subBoardWinners } = calculateWinner(currentBoards);

  
  function handleMove(subBoardIdx: number, squareIdx: number): void {
    const currentSubBoard = currentBoards[subBoardIdx];
    if (currentSubBoard[squareIdx] || // Blocks moves on filled squares
      subBoardWinners[subBoardIdx] || // Blocks moves on subboards that have been won
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
    const description = (isCurrentMove && gameWinner === 'draw')
      ? gameWinner
      : isCurrentMove
      ? `Currently on move #${move}`
      : move > 0 && moveCoordinates
      ? `${player} moved on (${moveCoordinates[0]}, ${moveCoordinates[1]})`
      : 'Game start';
    // Determine whether the li should be rendered as a paragraph or button based on currentMove
    return (
      <li key={move}>
        {isCurrentMove ? (
          <p>{description}</p>
        ) : (
          //<button onClick={() => jumpTo(move)}>{description}</button>
          <p>{description}</p>
        )}
      </li>
    );
  });

  return (
      <div className="game">
        <div className="status">{status}</div>
          <div className="meta-board">
          {Array.from({length: 3}, (_, row) => (
            <div className="meta-board-row" key={row}>
              {Array.from({length: 3}, (_, col) => {
                const subBoardIdx = row * 3 + col;
                const isWon = subBoardWinners[subBoardIdx]
                return (
                  <SubBoard
                    key={subBoardIdx}
                    subBoardIdx={subBoardIdx}
                    squares={currentBoards[subBoardIdx]}
                    onSquareClick={(squareIdx) => handleMove(subBoardIdx, squareIdx)}
                    isActive={isActive}
                    isWon={isWon}
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