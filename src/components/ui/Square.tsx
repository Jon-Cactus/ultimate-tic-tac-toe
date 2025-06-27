import type { SquareProps } from '../../../shared/interfaces';

export default function Square({ value, onSquareClick, active }: SquareProps) {
  const playerColor = // Determine correct class to add
    value === 'X'
    ? 'player-1'
    : value === 'O'
    ? 'player-2'
    : ''
  return (
    <button
    className={`square ${playerColor} ${active}`}
    onClick={onSquareClick}>
      {value}
    </button>
  )
}