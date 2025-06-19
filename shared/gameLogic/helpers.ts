import type { Board, Player} from '../interfaces';

export function calculateWinner(
  board: Board): { gameWinner: string | null; subBoardWinners: (string | null)[] }  {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  const subBoardWinners = board.map(subBoard => {
    for (let i: number = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (subBoard[a] && subBoard[a] === subBoard[b] && subBoard[a] === subBoard[c]) {
        return subBoard[a];
      }
    }
    if (!subBoard.includes(null)) return 'draw';
    return null;
  });

  let gameWinner: Player | string | null = null;
  for (let i: number = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (subBoardWinners[a] && subBoardWinners[a] === subBoardWinners[b] && subBoardWinners[a] === subBoardWinners[c]) {
       gameWinner = subBoardWinners[a];
       break;
    }
  }

  if (gameWinner === null && subBoardWinners.every(winner => winner === 'draw')) {
    gameWinner = 'draw';
  }
  return { gameWinner, subBoardWinners };
}

export function getMoveCoordinates(
  prevBoard: (string | null)[][] | undefined,
  currBoard: (string | null)[][]
): (number[] | null) {
  if (!prevBoard) {
    return null;
  }
  for (let boardIdx: number = 0; boardIdx < 9; boardIdx++) {
    if (prevBoard[boardIdx] && currBoard[boardIdx]) {
      for (let squareIdx: number = 0; squareIdx < 9; squareIdx++) {
        if (prevBoard[boardIdx][squareIdx] !== currBoard[boardIdx][squareIdx]) {
          return [boardIdx + 1, squareIdx + 1]
        }
      }
    }
  }
  return null;
}