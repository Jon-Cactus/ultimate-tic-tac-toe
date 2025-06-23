import type {HistoryListProps} from '../../../shared/interfaces';
import { getMoveCoordinates } from '../../../shared/gameLogic/helpers';

export default function HistoryList({ history, startingPlayer, currentMove, gameWinner }: HistoryListProps) {
    // Create move list
    let moves;
    if (history.length === 1) {
      moves = (
        <li key={0}>
          <p>No moves yet!</p>
        </li>
      )
    }
    moves = history.slice(1).map((board, move) => {
      const moveNumber = move + 1;
      const player = 
      startingPlayer === 'X'
      ? moveNumber % 2 === 1 ? 'X' : 'O'
      : moveNumber % 2 === 1 ? 'O' : 'X';
      const prevBoard = history[moveNumber - 1];
      // TODO: Needs altering to account for the 3d arrays
      const moveCoordinates = getMoveCoordinates(prevBoard, board);
        // Determine the correct description based on current move and move #
      const description = moveCoordinates
        ? `${player} moved on (${moveCoordinates[0]}, ${moveCoordinates[1]})`
        : gameWinner
        ? 'No more legal moves'
        : 'No moves yet!';
      // Determine whether the li should be rendered as a paragraph or button based on currentMove
      return (
        <li key={moveNumber}>
            <p>{description}</p>
        </li>
      );
    });

    return (
        <div className="game-info">
          <div className="current-move">Move #{`${currentMove + 1}`}</div>
          <div className="move-list-wrapper">
            <ol>{moves}</ol>
          </div>
        </div>
    )
}