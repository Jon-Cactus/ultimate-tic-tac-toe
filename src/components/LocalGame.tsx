import Game  from './Game';
import { useGameLogic } from '../../shared/hooks/useGameLogic';

export default function LocalGame() {
    const logic = useGameLogic(); 
    const player = logic.xIsNext ? 'X' : 'O';

    return (
        <Game
            history={logic.history}
            currentMove={logic.currentMove}
            activeSubBoard={logic.activeSubBoard}
            currentBoard={logic.currentBoard}
            startingPlayer={logic.startingPlayer}
            xIsNext={logic.xIsNext}
            gameWinner={logic.gameWinner}
            subBoardWinners={logic.subBoardWinners}
            resetBoard={() => logic.handleFirstMoveSelection()}
            onSquareClick={(sb, sq) => logic.handleMove(sb, sq, player!)}
        />
    )
}