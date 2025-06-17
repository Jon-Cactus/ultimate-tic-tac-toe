import { useEffect, useRef } from 'react';
import type { Socket } from 'socket.io-client';
import Game from './Game';
import { useGameLogic } from '../hooks/useGameLogic';
import type { OnlineGameProps } from '@shared/interfaces';


export default function OnlineGame({ roomId, socket, player }: OnlineGameProps) {
    const logic = useGameLogic();
    const socketRef = useRef<Socket>(socket);

    useEffect(() => {
        const s = socketRef.current;

        s.on('startGame', (data) => {
            logic.setHistory(data.history);
            logic.setCurrentMove(data.currentMove);
            logic.setActiveSubBoard(data.activeSubBoard);
            logic.setStartingPlayer(data.startingPlayer);
            logic.setGameStarted(true);
        });

        s.on('moveMade', (data) => {
            logic.setHistory(data.history);
            logic.setCurrentMove(data.currentMove);
            logic.setActiveSubBoard(data.activeSubBoard);
        });

        socket.connect();        
        
        return () => {
            s.off('startGame');
            s.off('moveMade');
        };
    }, []);

    const handleOnlineClick = (subBoardIdx: number, squareIdx: number) => {
        if (!logic.isValidMove(subBoardIdx, squareIdx) || !socketRef.current || !player) return; // Validate before sending to server
        socketRef.current.emit('makeMove', {
            roomId,
            subBoardIdx,
            squareIdx,
            player
        });
    };

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
            onSquareClick={handleOnlineClick}
            getMoveCoordinates={logic.getMoveCoordinates}
        />
    )

}
