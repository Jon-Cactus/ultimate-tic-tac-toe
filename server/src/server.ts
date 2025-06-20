import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { initGame } from '@shared/gameLogic/initGame';
import { validateMove } from '@shared/gameLogic/validateMove';
import { applyMove } from '@shared/gameLogic/applyMove';
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

// Socket logic
io.on('connection', (socket) => {
    console.log('[server] client connected', socket.id);

    // Host creates room
    socket.on('createGame', callback => {
        const roomId = Math.random().toString(36).substring(2, 8) // Generate random string of nums and chars
        const state = initGame(); // Create game state object
        rooms[roomId] = state;
        // Set host as either X or O
        socket.join(roomId);
        callback({ roomId, player: state.startingPlayer });
        // Send initial game state to host client
        socket.emit('startGame', state);
    });
    // Guest joins room
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
    // Handle moves
    socket.on('makeMove', (move: MakeMove) =>{
        const state = rooms[move.roomId];
        if (!state) return;

        if (!validateMove(state, move.subBoardIdx, move.squareIdx, move.player)) return;
        const nextState = applyMove(state, move.subBoardIdx, move.squareIdx, move.player);
        rooms[move.roomId] = nextState;
        io.in(move.roomId).emit('moveMade', nextState);
    });

    socket.on('disconnect', () => {
        console.log('[server] client disconnected', socket.id);
    });


});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});