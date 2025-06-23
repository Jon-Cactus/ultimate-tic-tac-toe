# Ultimate Tic-Tac-Toe


**What is Ultimate Tic-Tac-Toe?**


This project is a modern reimplementation of Ultimate Tic-Tac-Toe, built with a shared, functional game logic layer and support for both local and real-time multiplayer modes via WebSockets.

It features:

- Game Engine Logic shared across both frontend and backend

- Move validation & state history tracking, including active sub-board constraints

- Winner calculation for each sub-board and the overall game

- Multiplayer mode powered by Socket.IO with host/join room functionality

- Built using React, TypeScript, and Express

## File Breakdown

*Did I debate any design choices?*


## Stack

- Frontend: React + TypeScript

- Backend: Node.js + Express + Socket.IO

- Game Logic: Pure TypeScript module, shared between frontend and backend

- State Management: React hooks (custom useGameLogic)

- Styling: (Add if applicable—e.g., Tailwind, CSS Modules)
