import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import Game from './Game';
import { useGameLogic } from '../hooks/useGameLogic';
import { PlayerContext } from '../context/Context';
import type { OnlineGameProps, GameState } from '../../shared/interfaces';
import type { Socket } from 'socket.io-client'; // https://socket.io/docs/v4/client-api/#socket



export default function OnlineGame({ roomId, socket, isHost, guestJoined }: OnlineGameProps) {
    const logic = useGameLogic();
    const player = useContext(PlayerContext);
    const socketRef = useRef<Socket>(socket);
    const [undoRequested, setUndoRequested] = useState<boolean>(false);
    const [iSentRequest, setISentRequest] = useState<boolean>(false);
    const s = socketRef.current;


    useEffect(() => {
        s.on('startGame', (data) => {
            console.log('startGame on', player, data.startingPlayer);
            logic.syncState(data)
            setUndoRequested(false);
            setISentRequest(false);
        });
        s.on('moveMade', (data) => logic.syncState(data));
        s.on('undoRequested', () => setUndoRequested(true));
        s.on('undoAccepted', (data) => {
            logic.syncState(data);
            setUndoRequested(false);
            setISentRequest(false);
        });
        s.emit('getState', { roomId }, (data: GameState) => {
            console.log('getState reply on', player, data.startingPlayer);
            logic.syncState(data);
        })
        return () => {
            s.off('startGame');
            s.off('moveMade');
            s.off('resetRequested');
        };
    }, []); // Mount only once
    // Handle move flow
    const handleOnlineClick = useCallback((subBoardIdx: number, squareIdx: number) => {
        if (!logic.isValidMove(subBoardIdx, squareIdx, player)) return; // Validate before sending to server
        s.emit('makeMove', {
            roomId,
            subBoardIdx: subBoardIdx,
            squareIdx: squareIdx,
            player
        });
    }, [logic, player, roomId, s]);
    // Reset flow
    const requestUndo = useCallback(() => {
        if (logic.history.length === 0) return;
        s.emit('undoRequested', { roomId });
        setUndoRequested(true);
        setISentRequest(true);
    }, [logic.history.length, roomId, s]);

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
            // Game reset
            requestUndo={requestUndo}
            resetRequested={undoRequested}
            iSentRequest={iSentRequest}
            
            onSquareClick={handleOnlineClick}
            isHost={isHost}
            guestJoined={guestJoined}
            roomId={roomId}
        />
    )
}
