import SubBoard from './SubBoard';
import { BoardProps } from '../assets/interfaces';

export default function Board({ boards, activeSubBoard, onSquareClick, subBoardWinners}) {
    return (
        <div className="meta-board">
          {Array.from({length: 3}, (_, row) => (
            <div className="meta-board-row" key={row}>
              {Array.from({length: 3}, (_, col) => {
                const idx = row * 3 + col;
                return (
                  <SubBoard
                    key={idx}
                    idx={idx}
                    squares={boards[idx]}
                    onSquareClick={(squareIdx) => onSquareClick(idx, squareIdx)}
                    isActive={activeSubBoard === idx}
                    isWon={subBoardWinners[idx]}
                  />
                );
              })}
            </div>
          ))}
        </div>
    )
}