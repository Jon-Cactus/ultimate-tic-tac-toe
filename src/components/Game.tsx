import Board from './ui/Board';
import HistoryList from './ui/HistoryList';
import StatusBar from './ui/StatusBar';
import type { GameProps } from '@shared/interfaces';
import '../App.css';

export default function Game(props: GameProps) {
  // Unload props
  const {
    history,
    currentMove,
    activeSubBoard,
    startingPlayer,
    xIsNext,
    currentBoard,
    gameWinner,
    subBoardWinners, 
    onFirstMoveSelection,
    onSquareClick,
    isHost,
    guestJoined,
    roomId
   } = props

  return (
    <div className="container">
      <StatusBar
        gameWinner={gameWinner}
        xIsNext={xIsNext}
        isHost={isHost}
        guestJoined={guestJoined}
        roomId={roomId}
      />
      <div className="game">
        <div className="board-container">
          <Board 
            boards={currentBoard}
            activeSubBoard={activeSubBoard}
            onSquareClick={onSquareClick}
            subBoardWinners={subBoardWinners}
          />
          <div className="game-control">
            <button className="btn-base" onClick={onFirstMoveSelection}>
              Restart Game
            </button>
          </div>
        </div>
        <HistoryList 
          history={history}
          startingPlayer={startingPlayer}
          currentMove={currentMove}
          gameWinner={gameWinner}
        />
      </div>
    </div>
  );
}