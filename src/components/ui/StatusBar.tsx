import type { StatusBarProps } from '../../../shared/interfaces';
import { useMode, usePlayer } from '../../context/Context';

export default function StatusBar({ gameWinner, xIsNext, isHost, guestJoined, roomId }: StatusBarProps) {
    const mode = useMode();
    const player = usePlayer();
    const waitingForGuest = isHost && !guestJoined;
    // Check for winner, in which case the text changes
    const text = gameWinner 
    ? `Winner: ${gameWinner}`
    : (xIsNext)
    ? "X's move!"
    : "O's move!"

    if (mode === 'local') return (
        <div className="status">
            <span className="status-text">{text}</span>
        </div>
    )

    return ( // For online games
        <div className="status">
            {waitingForGuest && (
                <span className="status-text">
                    <p>
                        Share this Room ID with your friend to join: <code>{roomId}</code>
                    </p>
                </span>
            )}
            {!waitingForGuest && (
                <>
                    <span className="status-text">{`You are: ${player}`}</span>
                    <span className="status-text">{text}</span>
                </>
            )}
        </div>
    )
}