import type { SubBoardProps } from '../../../shared/interfaces';
import Square from './Square';

export default function SubBoard({ squares, onSquareClick, allActive, isActive, isWon }: SubBoardProps) {
  const playerColor = // Determine correct class to add
    isWon === 'X'
    ? 'player-1 won'
    : isWon === 'O'
    ? 'player-2 won'
    : ''

  return (
  <>
    <div className={`sub-board ${playerColor}`}>{isWon !== 'draw' ? isWon : ''}
      {Array.from({length: 3}, (_, row) => ( // Create a 3x3 array of squares
        <div className={`sub-board-row ${isWon ? 'hidden' : ''}`} key={row}>
          {Array.from({length: 3}, (_, col) => {
            const squareIdx = row * 3 + col; // Index squares 1-9
            return (
              <Square
                key={squareIdx}
                value={squares[squareIdx]}
                onSquareClick={() => onSquareClick(squareIdx)}
                active={isActive || allActive ? 'active' : ''}
              />
            )
          })}
        </div>
      ))}
    </div>
  </> 
  )
}