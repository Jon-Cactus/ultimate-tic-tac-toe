import Board from './ui/Board';
import HistoryList from './ui/HistoryList';
import StatusBar from './ui/StatusBar';
import Description from './ui/Description';
import type { GameProps } from '../../shared/interfaces';
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
    resetBoard,
    requestUndo,
    resetRequested,
    iSentRequest,
    onSquareClick,
    isHost,
    guestJoined,
    roomId
   } = props

   let resetBtn;
   if (roomId) {
    // Prepare text when the other player requests a undo
    const requestTxt = (resetRequested && !iSentRequest) ? 'Opponent has requested an undo!' : '';
    const isFirstMove = history.length > 1;

    // Change button text depending upon context
    const requestBtnTxt = (resetRequested && !iSentRequest) // Oponent requests undo
    ? 'Undo Last Move' 
    : (resetRequested && iSentRequest) // User requests undo
    ? 'Undo Requested'
    : 'Request Undo'; // Default
    
    resetBtn = (
      <div className="undo-control">
        <button className={`btn-base ${isFirstMove ? '' : 'hidden'}`}  onClick={requestUndo}>
          {requestBtnTxt}
        </button>
        <div>{requestTxt}</div>
      </div>
    )
   } else if (!roomId) {
    resetBtn = (
      <div className="undo-control">
        <button className="btn-base" onClick={() => resetBoard?.()}>
          Restart Game
        </button>
      </div>
    )
   }

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
          {resetBtn}
        </div>
        <HistoryList 
          history={history}
          startingPlayer={startingPlayer}
          currentMove={currentMove}
          gameWinner={gameWinner}
        />
      </div>
      <Description />
    </div>
  )
}