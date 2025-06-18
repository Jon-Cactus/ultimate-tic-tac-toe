import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { calculateWinner } from '@shared/gameLogic/helpers';
import type { GameState, MakeMove } from '@shared/interfaces';

// Environment setup
const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'; // Vite's default port
// Initialize app
const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
// Initialize server
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: CLIENT_ORIGIN }
});

// Object for room state
const rooms: Record<string, GameState> = {};
const playerRoles: Record<string, Record<string, 'X' | 'O'>> = {};

// Socket logic
io.on('connection', (socket) => {
    console.log('[server] client connected', socket.id);

    // Host creates room
    socket.on('createGame', (callback: (res: { roomId: string; player: 'X' | 'O' }) => void) => {
        const roomId = Math.random().toString(36).substring(2, 8) // Generate random string of nums and chars
        const state = initGame(); // Create game state object
        rooms[roomId] = state;
        // Set host as either X or O
        playerRoles[roomId] = { [socket.id]: state.startingPlayer };
        socket.join(roomId);
        callback({ roomId, player: state.startingPlayer });
        // Send initial game state to host client
        socket.emit('startGame', state);
    });
    // Guest joins room
    socket.on('joinGame', ({ roomId }: { roomId: string }, callback: ( res: { error?: string; player?: 'X' | 'O' }) => void) => {
        const state = rooms[roomId];
        if (!state) callback({ error: 'Room not found' });
        const taken = Object.values(playerRoles[roomId])[0];
        const open = taken === 'X' ? 'O' : 'X';
        playerRoles[roomId][socket.id]
        socket.join(roomId);
        socket.emit('startGame', state);
        callback({ player: open });
    });
    // Handle moves
    socket.on('makeMove', ({ roomId, subBoardIdx, squareIdx, player }: MakeMove) =>{
        const state = rooms[roomId];
        if (!state) return;

        const history = state.history.slice(0, state.currentMove + 1);
        const currentBoards = history[state.currentMove];
        // create shallow copy
        const nextBoards = currentBoards.map(board => [...board]);
        const nextSubBoard = [...nextBoards[subBoardIdx]];
        nextSubBoard[squareIdx] = player;
        nextBoards[subBoardIdx] = nextSubBoard;

        const { subBoardWinners: nextSubBoardWinners } = calculateWinner(nextBoards);

        const nextMove = history.length;
        const activeSubBoard = nextSubBoardWinners[squareIdx] ? null : squareIdx;

        state.history = [...history, nextBoards];
        state.currentMove = nextMove;
        state.activeSubBoard = activeSubBoard;

        io.in(roomId).emit('moveMade', state);
    });

    socket.on('disconnect', () => {
        console.log('[server] client disconnected', socket.id);
    });


});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});