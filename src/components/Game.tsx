import Board from './ui/Board';
import HistoryList from './ui/HistoryList';
import StatusBar from './ui/StatusBar';
import type { GameProps } from '../assets/interfaces';
import '../App.css';

export default function Game(props: GameProps) {
  const {
    history, currentMove, activeSubBoard, currentBoards, startingPlayer,
    xIsNext, gameStarted, gameWinner, subBoardWinners,
    onFirstMoveSelection, onSquareClick, getMoveCoordinates 
   } = props

  // Determine contents of the game control button
  const gameControlContent = <button className="btn-base" onClick={() => onFirstMoveSelection()}>
    {!startingPlayer && !gameStarted ? 'Who goes first?' : 'Restart Game'}
    </button>;



  return (
      <div className="game">
        <div className="board-container">
          <StatusBar gameWinner={gameWinner} xIsNext={xIsNext} gameStarted={gameStarted}></StatusBar>
          <Board 
            boards={currentBoards}
            activeSubBoard={activeSubBoard}
            onSquareClick={onSquareClick}
            subBoardWinners={subBoardWinners}
          />
          <div className="game-control">
            {gameControlContent}
          </div>
        </div>
        <HistoryList 
          history={history}
          startingPlayer={startingPlayer}
          currentMove={currentMove}
          gameWinner={gameWinner}
          getMoveCoordinates={getMoveCoordinates}
        />
      </div>
  );
}