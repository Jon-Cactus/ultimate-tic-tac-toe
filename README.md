# Ultimate Tic-Tac-Toe


**What is Ultimate Tic-Tac-Toe?**


This project is a React+TypeScript+Vite build of Ultimate Tic-Tac-Toe, implementing a shared, functional game logic layer and support for both local and real-time multiplayer modes via WebSockets (socket-io).

It features:

- Move validation & state history tracking, including active sub-board constraints

- Winner calculation for each sub-board and the overall game

- Multiplayer mode powered by Socket.IO with host/join room functionality

- Built using React, TypeScript, and Express

## File Breakdown

This project's file structure is divided between three folders: one for the client, server, and a layer for functional game engine logic shared between both the client and server sides.

### Client (`src`)

Put simply, the purpose of the contents found in the `src` folder is to receive information from either the
The client folder itself is divided into 

*Did I debate any design choices?*


## Stack

- Frontend: React + TypeScript

- Backend: Node.js + Express + Socket.IO

- Game Logic: Pure TypeScript module, shared between frontend and backend

- State Management: React hooks (custom useGameLogic)

- Styling: (Add if applicable—e.g., Tailwind, CSS Modules)
