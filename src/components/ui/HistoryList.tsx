import type {HistoryListProps} from '../../../shared/interfaces';
import { getMoveCoordinates } from '../../../shared/gameLogic/helpers';

export default function HistoryList({ history, startingPlayer, currentMove, gameWinner }: HistoryListProps) {
    // Create move list
    let moves;
    if (history.length <= 1) {
      moves = (
        <li key={0}>
        </li>
      )
    }
    // Go through history and produce a list item for each move
    moves = history.slice(1).map((currentEntry, index) => {
      const moveNumber = index + 1;
      // Determine the correct player for the move
      const player =
      startingPlayer === 'X'
      ? moveNumber % 2 === 1 ? 'X' : 'O'
      : moveNumber % 2 === 1 ? 'O' : 'X';

      const prevBoard = history[index].board;
      const currentBoard = currentEntry.board;
      const moveCoordinates = getMoveCoordinates(prevBoard, currentBoard);
        // Determine the correct description based on current move and move #
      const description = moveCoordinates
        ? `${player} moved on (${moveCoordinates[0]}, ${moveCoordinates[1]})`
        : gameWinner
        ? 'No more legal moves'
        : 'No moves yet!';
        
      return (
        <li key={moveNumber}>
            <p>{description}</p>
        </li>
      );
    });
    moves.reverse();

    return (
        <div className="game-info">
          <div className="current-move">Move #{`${currentMove + 1}`}</div>
          <div className="move-list-wrapper">
            <ol reversed>{moves}</ol>
          </div>
        </div>
    )
}