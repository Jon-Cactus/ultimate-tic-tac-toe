import { useState } from 'react';
import io, { Socket } from 'socket.io-client';
import OnlineGame from './OnlineGame';
import { PlayerContext } from '../context/Context';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function OnlineLobby() {
    const [socket] = useState<Socket>(() => io(BACKEND_URL, { autoConnect: false }));
    const [action, setAction] = useState<'host' | 'join' | null>(null);
    const [roomId, setRoomId] = useState<string>('');
    const [ready, setReady] = useState<boolean>(false);
    const [player, setPlayer] = useState<'X' | 'O' | null>(null);

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
                setReady(true);
            }
        });
    };

    if (!action) {
        return (
            <div className="lobby">
                <button className="btn-base" onClick={handleHost}>
                    Host Game
                </button>
                <div>
                    <input 
                        placeholder="Room ID to join"
                        value={roomId}
                        onChange={(e) => setRoomId(e.currentTarget.value)}
                    />
                    <button className="btn-base" onClick={handleJoin} disabled={!roomId}>Join Game</button>
                </div>
            </div>
        )
    }
    
    if (action === 'host' && !ready) {
        return (
            <div className="status">
                <div>
                    Your room ID is 
                    <span className="notification"> {roomId}</span>
                    . Please share with the other player!
                </div>
                <button className="btn-base" onClick={() => setReady(true)}>
                    Enter Game
                </button>
            </div>
        );
    }

    if (ready) {
        return (
            <PlayerContext.Provider value={player}>
                <OnlineGame roomId={roomId} socket={socket} player={player} />;
            </PlayerContext.Provider>
        )
    }

    return null;
}