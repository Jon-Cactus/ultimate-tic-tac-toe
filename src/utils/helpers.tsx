export function calculateWinner(squares: (string | null)[])  {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  for (let i: number = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

export function getMoveCoordinates(prevSquares: (string | null)[] | undefined, currentSquares: (string | null)[]): (number[] | null) {
  if (!prevSquares) {
    return null;
  }
  for (let i: number = 0; i < 9; i++) {
    if (prevSquares[i] !== currentSquares[i]) {
      const x = Math.floor(i / 3) + 1;
      const y = (i % 3) + 1;
      return [x, y];
    }
  }
  return null;
}