import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import Game from './Game';
import { useGameLogic } from '../hooks/useGameLogic';
import type { OnlineGameProps } from '@shared/interfaces';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function OnlineGame({ action, roomId }: OnlineGameProps) {
    const logic = useGameLogic();
    const socketRef = useRef<Socket>(null);

    useEffect(() => {
        const socket = io( BACKEND_URL, {});
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[socket] connected, id=', socket.id);
        });

        socket.on('startGame', (data) => {
            logic.setHistory(data.history);
            logic.setCurrentMove(data.currentMove);
            logic.setActiveSubBoard(data.activeSubBoard);
            logic.setStartingPlayer(data.startingPlayer);
            logic.setGameStarted(true);
        });

        socket.on('moveMade', (data) => {
            logic.setHistory(data.history);
            logic.setCurrentMove(data.currentMove);
            logic.setActiveSubBoard(data.activeSubBoard);
        });

        socket.connect();        
        
        return () => {
            socket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action, roomId]);

    const onlineMove = (subBoardIdx: number, squareIdx: number) => {
        if (!socketRef.current || !roomId) return;
        socketRef.current.emit('makeMove', {
            roomId,
            subBoardIdx,
            squareIdx,
            player: logic.xIsNext ? 'X' : 'O',
        });
    };

    const handleOnlineClick = (subBoardIdx: number, squareIdx: number) => {
        if (!logic.isValidMove(subBoardIdx, squareIdx) || !socketRef.current) return; // Validate before sending to server
        onlineMove(subBoardIdx, squareIdx);
    }

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
