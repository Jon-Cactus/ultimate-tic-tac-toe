import { useEffect, useRef, useContext } from 'react';
import Game from './Game';
import { useGameLogic } from '../../shared/hooks/useGameLogic';
import { PlayerContext } from '../context/Context';
import type { OnlineGameProps } from '../../shared/interfaces';
import type { Socket } from 'socket.io-client';



export default function OnlineGame({ roomId, socket, isHost, guestJoined }: OnlineGameProps) {
    const logic = useGameLogic();
    const player = useContext(PlayerContext);
    const socketRef = useRef<Socket>(socket);

    useEffect(() => {
        const s = socketRef.current;
        s.on('startGame', (data) => logic.syncState(data));
        s.on('moveMade', (data) => logic.syncState(data));
        socket.connect();        
        return () => {
            s.off('startGame');
            s.off('moveMade');
        };
    }, []);

    const handleOnlineClick = (subBoardIdx: number, squareIdx: number) => {
        if (!logic.isValidMove(subBoardIdx, squareIdx, player)) return; // Validate before sending to server
        socketRef.current.emit('makeMove', {
            roomId,
            subBoardIdx: subBoardIdx,
            squareIdx: squareIdx,
            player
        });
    };

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
            onFirstMoveSelection={logic.handleFirstMoveSelection}
            onSquareClick={handleOnlineClick}
            isHost={isHost}
            guestJoined={guestJoined}
            roomId={roomId}
        />
    )
}
