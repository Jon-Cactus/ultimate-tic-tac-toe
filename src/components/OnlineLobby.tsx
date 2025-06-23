import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import OnlineGame from './OnlineGame';
import { PlayerContext } from '../context/Context';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function OnlineLobby() {
    const [socket] = useState<Socket>(() => io(BACKEND_URL, { autoConnect: false }));
    const [action, setAction] = useState<'host' | 'join' | null>(null);
    const [roomId, setRoomId] = useState<string>('');
    const [player, setPlayer] = useState<'X' | 'O' | null>(null);
    const [guestJoined, setGuestJoined] = useState<boolean>(false);

    // Host flow
    const handleHost = () => {
        socket.connect();
        socket.emit('createGame', (res: { roomId: string; player: 'X' | 'O' }) => {
            setRoomId(res.roomId);
            setPlayer(res.player);
            setAction('host');
        });
    };
    
    const handleJoin = () => {
        socket.connect();
        socket.emit('joinGame', { roomId }, (res: { error?: string; player: 'X' | 'O' }) => {
            if (res.error) console.error(res.error);
            else {
                setAction('join');
                setPlayer(res.player);
                setGuestJoined(true);
            }
        });
    };

    useEffect(() => {
        if (action === 'host') {
            socket.on('guestJoined', () => {
                setGuestJoined(true);
            });
        }
        return () => {
            socket.off('guestJoined');
        }
    }, [action, socket])
    

    if (!action) {
        return (
            <div className="lobby">
                <button className="btn-base" onClick={handleHost}>
                    Host Game
                </button>
                <div className="block">
                    <input
                        placeholder="Room ID to join"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                    <button className="btn-base" onClick={handleJoin} disabled={!roomId}>Join Game</button>
                </div>
            </div>
        )
    }

    if (action && player) {
        return (
            <PlayerContext.Provider value={player}>
                <OnlineGame roomId={roomId} socket={socket} isHost={action === 'host'} guestJoined={guestJoined} />;
            </PlayerContext.Provider>
        )
    }

    return null;
}