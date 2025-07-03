import SubBoard from './SubBoard';
import type { BoardProps } from '../../../shared/interfaces';

export default function Board({ boards, activeSubBoard, onSquareClick, subBoardWinners}: BoardProps) {
  // Case of next player being able to move on any sub board
  const allActive = activeSubBoard === null ? true : false;
  
  return (
        <div className="meta-board">
          {Array.from({length: 3}, (_, row) => ( // Create a 3x3 array of sub boards
            <div className="meta-board-row" key={row}>
              {Array.from({length: 3}, (_, col) => {
                const idx = row * 3 + col; // Index sub boards 1-9
                return (
                  <SubBoard
                    key={idx}
                    squares={boards[idx]}
                    allActive={allActive}
                    isActive={activeSubBoard === idx}
                    onSquareClick={(squareIdx) => onSquareClick(idx, squareIdx)}
                    isWon={subBoardWinners[idx]}
                  />
                );
              })}
            </div>
          ))}
        </div>
    )
}