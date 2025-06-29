# Ultimate Tic-Tac-Toe


This project is a React+TypeScript+Vite build of Ultimate Tic-Tac-Toe, implementing a shared, functional game logic layer and support for both local and real-time multiplayer modes via WebSockets (socket-io).

It features:

- Move validation & state history tracking, including active sub-board constraints

- Winner calculation for each sub-board and the overall game

- Multiplayer mode powered by Socket.IO with host/join room functionality

- Built using React, TypeScript, and Express

**What is Ultimate Tic-Tac-Toe?**

Ultimate Tic-Tac-Toe expands upon vanilla Tic-Tac-Toe by allowing play on 9 separate boards, each mapping to the square of a larger meta-board. Players take turns placing X or O in the small boards, but the twist is: your move determines where your opponent plays next.

Allowing play on 9 different boards introduces a layer of complexity that often has players thinking 3 or more moves ahead.

**Rules**:

 - Players take turns placing their respective symbols ('X' or 'O') in squares
 across the board.

 - Moves can only be made in an "active" sub board

    - Sub boards are set as "active" based on the square index of the last move.
    If the square has an index of "3" (top-right square) within a sub board, the
    sub board with an index of "3" (top-right sub board) will be set as "active".

    - If a move is made in a square whose index corresponds to an already-taken
    sub board, every sub board will be set as "active".

- When an individual board is won, it is claimed by the player, becoming either 'X' or 'O'.

- When 3 boards are won in a row (rows, columns, or diagonals), the overall game is won.


# File Breakdown

### Architecture & File Structure

```text
ultimate-tic-tac-toe/
├── client/                # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Container components (Game, LocalGame, etc.)
│   │   │   └── ui/        # UI components (Square, SubBoard, etc.)
│   │   ├── context/       # React context providers (ModeContext etc.)
│   │   └── App.tsx
│   └── index.html
├── shared/                # Shared logic and types
│   ├── gameLogic/         # initGame, validateMove, applyMove, helpers
│   ├── hooks/             # Custom React hooks (useGameLogic)
│   └── interfaces.ts      # TypeScript interfaces
└── server/                # Express + Socket.IO backend
    └── src/
        └── server.ts      # Socket event handlers and room state
```
This project's file structure is divided between three folders: one for the client, server, and a layer for functional game engine logic shared between both the client and server sides.


## Client (`src`)

Put simply, the purpose of the contents found in the `src` folder is to receive the resulting processed game logic from either the shared logic folder in the case of a local game, or the server in the case of an online game.

At this folder's root live `App.tsx` and `main.tsx`, both of which are integral to a React project. `main.tsx` imports both `index.css` and acts as the top layer of the components structure. It calls `App` (App.tsx), which I have implemented as a wrapper for two components `LocalGame` and `OnlineLobby` in order to determine whether the player wants to play locally or online.

The client folder itself is divided into multiple subfolders:

### Components

`Components` houses the components (`Game.tsx`, `LocalGame.tsx`, `OnlineGame.tsx`, and `OnlineLobby.tsx`) which directly receive the resulting processed game logic to pass into the components found in its subfolder `ui`.

**OnlineLobby.tsx**

This component controls the host/guest flow before starting an online game. `OnlineLobby.tsx` tracks through state who is host and guest (`action`/`setAction`); sets a room ID (also saved through state) for the use of socket-io in order to index the game's board state; sets each player to either 'X' or 'O' (also tracked through state); and tracks (through state)when the guest joins the room in order to signal to the host's client that they may proceed to the game screen.

This component also sends API calls to the server via `socket.emit` (`createGame` and `joinGame`) to handle hosting and joining.

**OnlineGame.tsx**

This component is in charge of:
1. Syncing state between clients.

    - useEffect listens for events from the server, specifically when the game starts (`startGame`), when each move is made (`moveMade`), and when a request to reset has been made (`resetRequested`). It receives the data from the server and passes it into a function `syncState` in order to sync the state between each client.

2. Utilizing the shared game logic to validate and process moves.

    - A custom hook `useGameLogic()`, a part of the `shared` folder (to be explained later) is used to validate each move to ensure that:

        1. A user does not move when it is not their turn.

        2. A move is not made on a non-active sub board.

        3. A move is not made on a won sub board.

        4. A move is not made when the game has been won.

    - The hook is then used to pass all of the necessary information into the props of `Game.tsx` component for the client to render.

**LocalGame.tsx**

`LocalGame.tsx` essentially acts the same as `OnlineGame.tsx` but without neccessitating the syncing of game state.

**Game.tsx**

Receives props for UI updates:

- history (move history)

- currentMove (current move number)

- activeSubBoard (the current sub board that can be moved in)

- currentBoard (the current board state)

- startingPlayer (as the name implies, the starting player)

- xIsNext (used to determine whose turn it is)

- gameWinner (used to check if the game has been won)

- subBoardWinners (used to display won sub boards)

- resetBoard (for local use)

- requestReset (for requesting the other player to reset during online play)

- resetRequested (state used to change button text)

- iSentRequest (state used to indicate the player who requested, also changes button text)

- onSquareClick (this passes all the way down to the `Square` component, and handles clicks on squares)

Also passes information into the `StatusBar` and `HistoryList` components (to be explained later)

### ui (Components subfolder)

`ui` contains `Board.tsx`, `SubBoard.tsx`, `Square.tsx`, `HistoryList.tsx`, and `StatusBar.tsx`, all of which receive their props from either `Game.tsx` or `OnlineGame.tsx` (save for `description`, which is a simple component to display game rules).

Props passed to `Board.tsx`:

- `boards`: a snapshot of the current board.

- `activeSubBoard`: a number indicating the index of the active sub board (can also be `null` on certain moves).

- `onSquareClick`: function (can be either `handleOnlineClick` or `handleMove` depending on game mode) derived from the `useGameLogic` custom hook to handle move logic.

- `subBoardWinners`: an array of 9 elements of either 'X', 'O', or null to determine which players have won a given sub board.

**Board.tsx**

Receives `boards`, `activeSubBoard`, `onSquareClick`, and `subBoardWinners` as props and creates a 3x3 array of 9 sub boards programmatically via two loops, also assigning each sub board an index (`idx`). Passes props into each sub board at the end of each inner loop.

Props passed to `SubBoard.tsx`:

- key (React convention)

- `squares`: uses `boards` and the board index to create a snapshot of the board's state in order to determine which symbol goes in each square.

- `isActive`: evaluates to a boolean (`activeSubBoard === idx`), used to apply the `active` class to the squares in a given sub board when active.

- `onSquareClick`: the sub board index and square index (received from `SubBoard.tsx`) are passed into the function.

- `isWon`: At this layer the `subBoardWinners` array is accessed with the sub board index to retrieve the value of the array at that index.

**SubBoard.tsx**

Receives `squares` (a snapshot of each sub board's squares), `onSquareClick`, `isActive`, and `isWon` from `board.tsx` and creates another 3x3 array of 9 squares programmatically via two loops, assigning each an index (`squareIdx`). Passes props into each square at the end of each inner loop.

Props passed to `Square.tsx`:

- `key` (react convention)

- `value`: uses `squares` and the `squareIdx` to find the symbol (or lack thereof) at each square.

- `onSquareClick`: passes squareIdx into the function to be used at the `SubBoard.tsx` layer.

- `active`: uses `isActive` and ternary operator in order to pass the `active` class or nothing to the `Square`.

**Square.tsx**

Receives `value`, `onSquareClick`, and `active` from `SubBoard.tsx`. Applies `value` to the value of the button's inner text, `active` to its class list, and sets `onSquareClick` as the button's `onClick` value.

**HistoryList.tsx**

This file's job is to generate an unordered list of every move made during a game, with each item including which player made the move, and the coordinates of the move. `HistoryList.tsx` also displays the current move number.

Receives the following props from `Game.tsx`:

- `history`: a 2D array of every move made in the game (an array where each element is the board state for a given move).

- `startingPlayer`: Used to determine which player makes a given move.

- `currentMove`: Used to display the current move number at the top of the list.

- `gameWinner`: Checks if the game has been won and displays 'No more legal moves' in the case that a player has won.

**StatusBar.tsx**

This file's job is to determine the correct text to display above the board, indicating the status of the game. Depending on the `mode` (online or local), it will display text differently.

Receives the following props from `Game.tsx`:

- `GameWinner`: Used to determine when to display text indicating that a player has won the game.

- `xIsNext`: Used to determine when to display text indicating which player is next to move.

- `isHost` and `guestJoined`: Used to determine when to display text containing the join code for a guest to the host.

- `roomId`: The join code to display to the host when the guest has not yet joined.

### context

Contains `Context.ts`, which implements React's `useContext` hook to provide `StatusBar.tsx` with player information and which mode has been selected (necessary for online play in determining the appropriate text to display).

## shared

Contains the `gameLogic` and `hooks` subfolders, as well as `interfaces.ts` at its root, which houses all of the project's TypeScript interfacess.

### gameLogic

gameLogic contains several files crucial in handling changing game state.

**initGame.ts**

`initGame.ts` initializes an empty 2D array (Array of 3x3 arrays) to track move history and then returns it along with the necessary information to initialize a game using `setGameState()` from `useGameLogic.ts` (elaborated on later).

**validateMove.ts**

Receives `state`, `subBoardIdx`, `squareIdx`, and `player` and checks that a move is not:

1. made when it is the other player's turn.

2. on a filled square.

3. on a sub board that has already been won

4. made when the overall game has already been won.

5. made on a non-active sub board.

Returns a boolean.

**applyMove.ts**

Receives `state`, `subBoardIdx`, `squareIdx`, and `player` and appends the move to the game state's history. Also checks for sub board winners and sets the next active sub board(s).

**index.ts**

This file exists solely for the purpose of wrapping `initGame.ts`, `validateMove.ts`, and `applyMove.ts` for the purpose of cleaner imports.

**helpers.ts**

Contains two functions:

- `calculateWinner()`: defines a 2d array of all possible win paterns and checks each sub board for a win, and an overall board win. Returns two values: `gameWinner` and `subBoardWinners`.

- `getMoveCoordinates()`: Returns the last move's coordinates by checking for a difference between the previous move's board snapshot and the current board's snapshot.

### hooks

Contains `useGameLogic.ts`. This file unites the logic found in the `gameLogic` folder, and handles:

1. Syncing board state between clients in the case of an online game.

2. Validating moves.

3. Handling moves (update state) in the case that a move is legal.

4. Returning the necessary information for `OnlineGame.tsx` and `LocalGame.tsx`


## server

Contains json config files and node modules, but most importantly `src` which holds the backend's logic file `server.ts`

**server.ts**

This file implements **Node.js**, **Express**, and **Socket.IO** to create a real-time multiplayer server. It:

- Initializes a server using **Express**, then creates an HTTP server and attaches a SOCKET.IO instance.

- Manages game rooms, storing each room as a key-value pair where the `key` is a random 6-character alphanumeric string, and the `value` is the current `GameState` for that room.

- Handles events with Socket.IO:

    1. `connection`:

    ```ts
    io.on('connection', (socket) => {...})
    ```

    - Triggered when a client connects.

    - Registers event handlers for the client's socket.

    2. `createGame`: 

    ```ts
    socket.on('createGame', callback => {
        const roomId = Math.random().toString(36).substring(2, 8)
        const state = initGame();
        rooms[roomId] = state;
        socket.join(roomId);
        callback({ roomId, player: state.startingPlayer });
        socket.emit('startGame', state);
    });
    ```
    
    - triggers when the host creates a game.

    - Generates a random 6-character alphanumeric string.

    - Initializes a new game state via `initGame()` from `shared`, then stores it in memory.

    - Joins host to the room then assigns them as either 'X' or 'O'.

    - Emits `startGame` with `GameState` to the host.

    3. `joinGame`:

    ```ts
    socket.on('joinGame', ({ roomId }, callback) => {
        const state = rooms[roomId];
        if (!state) return callback({ error: 'Room not found' });
        const taken = state.startingPlayer;
        const open = taken === 'X' ? 'O' : 'X';
        socket.join(roomId);
        callback({ player: open });
        socket.emit('startGame', state);
        socket.to(roomId).emit('guestJoined');
    });
    ```

    - Triggers when the guest requests to join an existing room.

    - Checks that the room exists.

    - Assigns the guest the opposite symbol of the host.

    - Sends `startGame` to guest with the current `GameState`.

    - Notifies host via `guestJoined` event.

    4. `makeMove`:
    
    ```ts
    socket.on('makeMove', (move: MakeMove) =>{
        const state = rooms[move.roomId];
        if (!state) return;
        if (!validateMove(state, move.subBoardIdx, move.squareIdx, move.player)) return;
        const nextState = applyMove(state, move.subBoardIdx, move.squareIdx, move.player);
        rooms[move.roomId] = nextState;
        io.in(move.roomId).emit('moveMade', nextState);
    });
    ```

    - Receives a move from a player.

    - Validates the move using `validateMove()` from `gameLogic`.

    - Applies the move via `applyMove()` (also from `gameLogic`) and updates the room's state.

    - broadcasts the new move to both players via `io.in(move.roomId).emit('moveMade', nextState)`.

    5. `resetRequested`:

    ```ts
    socket.on('resetRequested', ({ roomId }: { roomId: string }) => {
        if (!resetRequests[roomId]) resetRequests[roomId] = new Set();
        resetRequests[roomId].add(socket.id);
        socket.to(roomId).emit('resetRequested');
    
        const participants = io.sockets.adapter.rooms.get(roomId) || new Set();
        if (resetRequests[roomId].size >= participants.size) {
            const newState = initGame();
            rooms[roomId] = newState;
            resetRequests[roomId].clear();
            io.in(roomId).emit('startGame', newState);
        }
    });
    ```
    
    - Receives a reset request from a player.

    - Notifies the other player that a reset has been requested.

    - Creates a fresh game state and sends it to the client with the `startGame` event.

    6. `disconnect`:

    ```ts
    socket.on('disconnect', () => {
        console.log('[server] client disconnected', socket.id);
    });
    ```

    - Simply logs when a client disconnects.




Validates and applies moves, and synchronizes game state between clients.


## Project Goals

UNFINISHED

I set out at the beginning of this project to achieve several goals:

1. Solidify fundamental React concepts:

    - Work with multiple layers of components in tandem with one another.

    - useState, useRef, useEffect, and useContext.

2. Transition from JavaScript to TypeScript:

    - Ensure delicate use of types to catch bugs before they arise

3. Gain an understanding of Node.js:

    - 
## Design Decisions

- **Pure Shared Logic**: 
    - Single source of truth for game rules. I initially ran into issues with desyncing logic between clients due to split logic between the client and server.

- **Server-Authoritative**: Prevents cheating by validating moves centrally.

- **React Hooks**: `useGameLogic` encapsulates state and exposes clear API.


## Stack

- Frontend: React + TypeScript

- Backend: Node.js + Express + Socket.IO

- Game Logic: Pure TypeScript module, shared between frontend and backend

- State Management: React hooks (custom useGameLogic)

- Styling: CSS
