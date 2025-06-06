import { useState } from 'react';
import type {SubBoardProps, SquareProps} from '../assets/interfaces';
import { calculateWinner, getMoveCoordinates } from '../utils/helpers';
import '../App.css';

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

  let gameControlContent;
  if (!startingPlayer && !gameStarted) {
    gameControlContent = <button className="btn-base" onClick={() => handleFirstMoveSelection()}>Who goes first?</button>
  } else {
    gameControlContent = <button className="btn-base " onClick={() => handleFirstMoveSelection()}>Restart Game</button>
  }

  // Create move list
  let moves;
  if (history.length === 1) {
    moves = (
      <li key={0}>
        <p>No moves yet!</p>
      </li>
    )
  }
  moves = history.slice(1).map((board, move) => {
    const moveNumber = move + 1;
    const player = 
    startingPlayer === 'X'
    ? ((moveNumber % 2 === 1) ? 'X' : 'O')
    : ((moveNumber % 2 === 0) ? 'O' : 'X');
    const prevBoard = history[moveNumber - 1];
    // TODO: Needs altering to account for the 3d arrays
    const moveCoordinates = getMoveCoordinates(prevBoard, board);
      // Determine the correct description based on current move and move #
    const description = moveCoordinates
      ? `${player} moved on (${moveCoordinates[0]}, ${moveCoordinates[1]})`
      : gameWinner
      ? 'No more legal moves'
      : 'No moves yet!';
    // Determine whether the li should be rendered as a paragraph or button based on currentMove
    return (
      <li key={moveNumber}>
          <p>{description}</p>
      </li>
    );
  });

  return (
      <div className="game">
        <div className="board-container">
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