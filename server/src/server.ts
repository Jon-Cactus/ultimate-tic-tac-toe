import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io'; // https://socket.io/docs/v4/server-api/#socket
import cors from 'cors';
import { initGame } from '../../shared/gameLogic/initGame.js';
import { validateMove } from '../../shared/gameLogic/validateMove.js';
import { applyMove } from '../../shared/gameLogic/applyMove.js';
import type { GameState, MakeMove } from '../../shared/interfaces.js';


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
// Object to track which sockets have requested resets
const undoRequests: Record<string, Set<string>> = {};

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
        io.in(roomId).emit('startGame', state);
        socket.to(roomId).emit('guestJoined');
    });

    socket.on('getState', ({ roomId }: { roomId: string }, callback: (state: GameState) => void) => {
        const state = rooms[roomId];
        if (state) callback(state);
    })
    // Handle moves
    socket.on('makeMove', (move: MakeMove) =>{
        const state = rooms[move.roomId];
        if (!state) return;

        if (!validateMove(state, move.subBoardIdx, move.squareIdx, move.player)) return;
        const nextState = applyMove(state, move.subBoardIdx, move.squareIdx, move.player);
        rooms[move.roomId] = nextState;
        io.in(move.roomId).emit('moveMade', nextState);
    });

    socket.on('undoRequested', ({ roomId }: { roomId: string }) => {
        // Ensure that a set exists
        if (!undoRequests[roomId]) undoRequests[roomId] = new Set();
        // Record that this socket wants a reset
        undoRequests[roomId].add(socket.id);
        // Notify other player that a reset has been requested
        socket.to(roomId).emit('undoRequested');

        if (undoRequests[roomId].size >= 2) {
            const gameState = rooms[roomId];

            if (gameState.currentMove === 0) {
                undoRequests[roomId].clear();
                return;
            }

            gameState.currentMove --; // Decrement move counter
            gameState.history.pop();  // Remove the last entry from history
            const previousState = gameState.history[gameState.currentMove];
            // Retrieve previous active sub board; set active board to null if reverting to first move
            gameState.activeSubBoard = previousState.activeSubBoard;
            gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X'; // Rrevert to previous player
            // Clear any pending requests
            undoRequests[roomId].clear();
            io.in(roomId).emit('undoAccepted', gameState);
        }
    });

    // TODO: add an option to "play again?" when a player wins?

    socket.on('disconnect', () => {
        console.log('[server] client disconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});