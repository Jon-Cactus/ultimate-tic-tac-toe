import type { Board, Player, SubBoard } from '../interfaces.js';

export function calculateWinner(
  board: Board
): { gameWinner: Player | 'draw' | null; subBoardWinners: (Player | 'draw' | null)[] } {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  const subBoardWinners = board.map((subBoard: SubBoard) => {
    for (const line of lines) {
      const [a, b, c] = line;
      // Ensure a, b, c are not undefined before using as indexes
      if (a === undefined || b === undefined || c === undefined) continue;

      const squareA = subBoard[a];
      if (squareA && squareA === subBoard[b] && squareA === subBoard[c]) {
        return squareA;
      }
    }
    if (!subBoard.includes(null)) return 'draw';
    return null;
  });

  let gameWinner: Player | 'draw' | null = null;
  for (const line of lines) {
    const [a, b, c] = line;
    // Ensure a, b, c are not undefined
    if (a === undefined || b === undefined || c === undefined) continue;

    const winnerA = subBoardWinners[a];
    // Ensure the winner isn't just a draw before declaring a game winner
    if (winnerA && winnerA !== 'draw' && winnerA === subBoardWinners[b] && winnerA === subBoardWinners[c]) {
      gameWinner = winnerA;
      break;
    }
  }

  if (gameWinner === null && subBoardWinners.every((winner) => winner !== null)) {
    gameWinner = 'draw';
  }
  return { gameWinner, subBoardWinners };
}

export function getMoveCoordinates(
  prevBoard: Board | undefined,
  currBoard: Board
): number[] | null {
  if (!prevBoard) {
    return null;
  }
  for (let boardIdx = 0; boardIdx < 9; boardIdx++) {
    const prevSubBoard = prevBoard[boardIdx];
    const currSubBoard = currBoard[boardIdx];

    // Ensure both sub-boards exist before comparing
    if (prevSubBoard && currSubBoard) {
      for (let squareIdx = 0; squareIdx < 9; squareIdx++) {
        if (prevSubBoard[squareIdx] !== currSubBoard[squareIdx]) {
          return [boardIdx + 1, squareIdx + 1];
        }
      }
    }
  }
  return null;
}