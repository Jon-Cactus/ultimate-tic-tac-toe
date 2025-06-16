import { useState } from 'react';
import io, { Socket } from 'socket.io-client';
import OnlineGame from './OnlineGame';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function OnlineLobby() {
    const [socket] = useState<Socket>(() => io(BACKEND_URL, { autoConnect: false}));
    const [action, setAction] = useState<'host' | 'join' | null>(null);
    const [roomId, setRoomId] = useState<string>('');

    const handleHost = () => {
        socket.connect();
        socket.emit('createGame', (res: { roomId: string }) => {
            setRoomId(res.roomId);
            setAction('host');
        })
    };

    const handleJoin = () => {
        socket.connect();
        socket.emit('joinGame', { roomId }, (res: { error?: string }) => {
            if (res.error) console.error(res.error)
        })
    }
    
    if (!action) {
        return (
            <div className="lobby">
                <button className="btn-base" onClick={handleHost}>Host Game</button>
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
    } else if (action === 'host' && roomId) {
        return (
            <div className="status">
                Your room ID is 
                <span className="notification"> {roomId}</span>
                . Please share with the other player!
            </div>
        )
    }

    return <OnlineGame action={action} roomId={roomId} />
}