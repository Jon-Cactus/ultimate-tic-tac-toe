import Game  from './Game';
import { useGameLogic } from '@shared/hooks/useGameLogic';

export default function LocalGame() {
    const logic = useGameLogic();

    return (
        <Game
            history={logic.history}
            currentMove={logic.currentMove}
            activeSubBoard={logic.activeSubBoard}
            currentBoards={logic.currentBoards}
            startingPlayer={logic.startingPlayer}
            xIsNext={logic.xIsNext}
            gameStarted={logic.gameStarted}
            gameWinner={logic.gameWinner}
            subBoardWinners={logic.subBoardWinners}
            onFirstMoveSelection={logic.handleFirstMoveSelection}
            onSquareClick={logic.handleMove}
            getMoveCoordinates={logic.getMoveCoordinates}
        />
    )
}