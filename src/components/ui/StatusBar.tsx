import type { StatusBarProps } from '../../assets/interfaces';

export default function StatusBar({ gameWinner, xIsNext, gameStarted }: StatusBarProps) {
    const text = gameWinner 
    ? `Winner: ${gameWinner}`
    : gameStarted
    ? `Next player: ${xIsNext ? 'X' : 'O'}`
    : 'Click button below to start game!';

    return (
        <div className="status">{text}</div>
    )
}