export default function Description() {
    return (
        <details className="description">
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            What is Ultimate Tic-Tac-Toe?
          </summary>
          <p>
            Ultimate Tic-Tac-Toe expands upon vanilla Tic-Tac-Toe by allowing play on 9 
            separate boards, each mapping to the square of a larger meta-board. Players 
            take turns placing X or O in the small boards, but the twist is: your move 
            determines where your opponent plays next.
            
            Allowing play on 9 different boards introduces a layer of complexity that 
            often has players thinking 3 or more moves ahead.
          </p>
          <strong>Game Rules:</strong>
          <ul>
            <li>Players take turns placing their respective symbols ('X' or 'O') in squares
            across the board.</li>
            <li>Moves can only be made in an "active" sub board</li>
            <ul>
                <li>Sub boards are set as "active" based on the square index of the last move.
                If the square has an index of "3" (top-right square) within a sub board, the
                sub board with an index of "3" (top-right sub board) will be set as "active".</li>
                <li>If a move is made in a square whose index corresponds to an already-taken
                sub board, every sub board will be set as "active".</li>
            </ul>
            <li>When an individual board is won, it is claimed by the player, 
                becoming either 'X' or 'O'.</li>
            <li>When 3 boards are won in a row (rows, columns, or diagonals), the overall game is won.</li>
          </ul>
        </details>
    )
}