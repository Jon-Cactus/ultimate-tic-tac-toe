import Game  from './Game';
import { useGameLogic } from '../hooks/useGameLogic';
import { useCallback } from 'react';

export default function LocalGame() {
    const logic = useGameLogic(); 
    const player = logic.xIsNext ? 'X' : 'O';

    const handleLocalClick = useCallback((sb: number, sq: number) =>{
        logic.handleMove(sb, sq, player!);
    }, [logic, player]);

    return (
        <Game
            history={logic.history}
            currentMove={logic.currentMove}
            activeSubBoard={logic.activeSubBoard}
            currentBoard={logic.currentBoard}
            startingPlayer={logic.startingPlayer}
            currentPlayer={logic.currentPlayer}
            xIsNext={logic.xIsNext}
            gameWinner={logic.gameWinner}
            subBoardWinners={logic.subBoardWinners}
            resetBoard={() => logic.handleFirstMoveSelection()}
            onSquareClick={handleLocalClick}
        />
    )
}