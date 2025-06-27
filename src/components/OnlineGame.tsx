import { useState, useEffect, useRef, useContext } from 'react';
import Game from './Game';
import { useGameLogic } from '../../shared/hooks/useGameLogic';
import { PlayerContext } from '../context/Context';
import type { OnlineGameProps } from '../../shared/interfaces';
import type { Socket } from 'socket.io-client'; // https://socket.io/docs/v4/client-api/#socket



export default function OnlineGame({ roomId, socket, isHost, guestJoined }: OnlineGameProps) {
    const logic = useGameLogic();
    const player = useContext(PlayerContext);
    const socketRef = useRef<Socket>(socket);
    const [resetRequested, setResetRequested] = useState<boolean>(false);
    const [iSentRequest, setISentRequest] = useState<boolean>(false);
    const s = socketRef.current;


    useEffect(() => {
        s.on('startGame', (data) => {
            console.log('↪ startGame on', player, data.startingPlayer);
            logic.syncState(data)
            setResetRequested(false);
            setISentRequest(false);
        });
        s.on('moveMade', (data) => logic.syncState(data));
        s.on('resetRequested', () => setResetRequested(true));
        return () => {
            s.off('startGame');
            s.off('moveMade');
            s.off('resetRequested');
        };
    }, []); // Mount only once
    // Handle move flow
    const handleOnlineClick = (subBoardIdx: number, squareIdx: number) => {
        if (!logic.isValidMove(subBoardIdx, squareIdx, player)) return; // Validate before sending to server
        s.emit('makeMove', {
            roomId,
            subBoardIdx: subBoardIdx,
            squareIdx: squareIdx,
            player
        });
    };
    // Reset flow
    const requestReset = () => {
        s.emit('resetRequested', { roomId });
        setResetRequested(true);
        setISentRequest(true);
    }

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
            // Game reset
            requestReset={requestReset}
            resetRequested={resetRequested}
            iSentRequest={iSentRequest}
            
            onSquareClick={handleOnlineClick}
            isHost={isHost}
            guestJoined={guestJoined}
            roomId={roomId}
        />
    )
}
