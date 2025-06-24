# Ultimate Tic-Tac-Toe


**What is Ultimate Tic-Tac-Toe?**


This project is a React+TypeScript+Vite build of Ultimate Tic-Tac-Toe, implementing a shared, functional game logic layer and support for both local and real-time multiplayer modes via WebSockets (socket-io).

It features:

- Move validation & state history tracking, including active sub-board constraints

- Winner calculation for each sub-board and the overall game

- Multiplayer mode powered by Socket.IO with host/join room functionality

- Built using React, TypeScript, and Express

# File Breakdown

This project's file structure is divided between three folders: one for the client, server, and a layer for functional game engine logic shared between both the client and server sides.

## Client (`src`)

Put simply, the purpose of the contents found in the `src` folder is to receive the resulting processed game logic from either the shared logic folder in the case of a local game, or the server in the case of an online game.

At this folder's root live `App.tsx` and `main.tsx`, both of which are integral to a React project. `main.tsx` imports both the css file and acts as the top layer of the components structure. It calls `App` (App.tsx), which I have implemented as a wrapper for two components `LocalGame` and `OnlineLobby` in order to determine whether the player wants to play locally or online.

The client folder itself is divided into multiple subfolders:

### Components

`Components` houses the components (`Game.tsx`, `LocalGame.tsx`, `OnlineGame.tsx`, and `OnlineLobby.tsx`) which directly receive the resulting processed game logic to pass into the components found in its subfolder `ui`.

**OnlineLobby.tsx**

This component controls the host/guest flow before starting an online game. `OnlineLobby.tsx` tracks through state who is host and guest (`action`/`setAction`); sets a room ID (also saved through state) for the use of socket-io in order to index the game's board state; sets each player to either 'X' or 'O' (also tracked through state); and tracks (through state)when the guest joins the room in order to signal to the host's client that they may proceed to the game screen.

This component also sends API calls to the server via `socket.emit` (`createGame` and `joinGame`) to handle hosting and joining.

**OnlineGame.tsx**

This component is in charge of:
1. Syncing state between clients
    - useEffect listens for events from the server, specifically when the game starts (`startGame`) and when each move is made (`moveMade`). It receives the data from the server and passes it into a function `syncState` in order to sync the state between each client.

2. Utilizing the shared game logic to validate and process moves
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
1. history (move history)
2. currentMove (current move number)
3. activeSubBoard (the current sub board that can be moved in)
4. currentBoard (the current board state)
5. startingPlayer (as the name implies, the starting player)
6. xIsNext (used to determine whose turn it is)
7. gameWinner (used to check if the game has been won)
8. subBoardWinners (used to display won sub boards)
9. onRestartGame UNDER CONSTRUCTION
10. onSquareClick (this passes all the way down to the `Square` component, and handles clicks on squares)

Also passes information into the `StatusBar` and `HistoryList` components (to be explained later)

### ui subfolder

`ui` contains `Board.tsx`, `SubBoard.tsx`, `Square.tsx`, `HistoryList.tsx`, and `StatusBar.tsx`, all of which receive their props from either `Game.tsx` or `OnlineGame.tsx`.

**Board.tsx**

Receives `boards`, `activeSubBoard`, `onSquareClick`, and `subBoardWinners` as props and creates a 3x3 array of sub boards programmatically via two loops, also assigning each sub board an index (`idx`). Passes props into each sub board at the end of each inner loop.

**SubBoard.tsx**

Receives `squares` (a snapshot of each sub board's squares), `onSquareClick`, `isActive`, and `isWon` from `board.tsx` 

*Did I debate any design choices?*


## Stack

- Frontend: React + TypeScript

- Backend: Node.js + Express + Socket.IO

- Game Logic: Pure TypeScript module, shared between frontend and backend

- State Management: React hooks (custom useGameLogic)

- Styling: (Add if applicable—e.g., Tailwind, CSS Modules)
