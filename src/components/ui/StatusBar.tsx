import type { StatusBarProps } from '../../assets/interfaces';
import { useMode } from '../../context/ModeContext';

export default function StatusBar({ gameWinner, xIsNext, gameStarted }: StatusBarProps) {
    const mode = useMode();

    const text = gameWinner 
    ? `Winner: ${gameWinner}`
    : gameStarted
    ? `Next player: ${xIsNext ? 'X' : 'O'}`
    : mode === 'local'
    ? 'Decide who will be X and O, then click the button below to start game!'
    : 'Click button below to start game!';

    return (
        <div className="status">{text}</div>
    )
}