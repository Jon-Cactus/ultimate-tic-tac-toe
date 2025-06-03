export function calculateWinner(currentMetaBoard: (string | null)[][]): { gameWinner: string | null; subBoardWinners: (string | null)[] }  {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  const subBoardWinners = currentMetaBoard.map(subBoard => {
    for (let i: number = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (subBoard[a] && subBoard[a] === subBoard[b] && subBoard[a] === subBoard[c]) {
        return subBoard[a];
      }
    }
    if (!subBoard.includes(null)) {
      return 'draw';
    }
    return null;
  })
  let gameWinner = null;
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

export function getMoveCoordinates(prevBoard: (string | null)[][] | undefined, currentSquares: (string | null)[][]): (number[] | null) {
  if (!prevBoard) {
    return null;
  }
  for (let i: number = 0; i < 9; i++) {
    if (prevBoard[i] !== currentSquares[i]) {
      const x = Math.floor(i / 3) + 1;
      const y = (i % 3) + 1;
      return [x, y];
    }
  }
  return null;
}