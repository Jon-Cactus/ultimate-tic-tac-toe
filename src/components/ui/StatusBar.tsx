import type { StatusBarProps } from '@shared/interfaces';
import { useMode, usePlayer } from '../../context/Context';

export default function StatusBar({ gameWinner, xIsNext, gameStarted }: StatusBarProps) {
    const mode = useMode();
    const player = usePlayer();

    const text = gameWinner 
    ? `Winner: ${gameWinner}`
    : gameStarted
    ? `Next player: ${xIsNext ? 'X' : 'O'}`
    : mode === 'local'
    ? 'Decide who will be X and O, then click the button below to start game!'
    : 'Click button below to start game!';

    return (
        <div className="status">
            <span>You are: {player}</span>
            <span>{text}</span>
        </div>
    )
}