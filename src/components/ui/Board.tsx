import SubBoard from './SubBoard';
import type { BoardProps } from '@shared/interfaces';

export default function Board({ boards, activeSubBoard, onSquareClick, subBoardWinners}: BoardProps) {
    return (
        <div className="meta-board">
          {Array.from({length: 3}, (_, row) => (
            <div className="meta-board-row" key={row}>
              {Array.from({length: 3}, (_, col) => {
                const idx = row * 3 + col;
                return (
                  <SubBoard
                    key={idx}
                    squares={boards[idx]}
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