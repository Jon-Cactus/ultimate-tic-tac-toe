import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
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

// Initialize a new game
function initGame(): GameState {
    return {
        history: [Array(9).fill(null).map(() => Array(9).fill(null))],
        currentMove: 0,
        activeSubBoard: null,
        startingPlayer: Math.random() < 0.5 ? 'X' : 'O'
    };    
}

// Socket logic

io.on('connection', (socket) => {
    console.log('[server] client connected', socket.id);

    // Host creates room
    socket.on('createGame', (callback: (res: { roomId: string}) => void) => {
        const roomId = Math.random().toString(5).substring(2, 8) // Generate random string of nums and chars
        const state = initGame(); // Create game state object
        rooms[roomId] = state;
        socket.join(roomId);
        callback({ roomId });
        // Send initial game state to host client
        socket.emit('startGame', state);
    });
    // Guest joins room
    socket.on('joinGame', ({ roomId }: { roomId: string }, callback: ( res: { error?: string }) => void) => {
        const state = rooms[roomId];
        if (!state) {
            callback({ error: 'Room not found' });
        }
        socket.join(roomId);
        socket.emit('startGame', state);
        callback({});
    });
    // Handle moves
    socket.on('makeMove', ({ roomId, subBoardIdx, squareIdx, player }: MakeMove) =>{
        const state = rooms[roomId];
        if (!state) return;

        const history = state.history.slice(0, state.currentMove + 1);
        const currentBoards = history[state.currentMove];
        // create shallow copy
        const nextBoards = currentBoards.map((board) => [...board]);
        const nextSubBoard = [...nextBoards[subBoardIdx]];
        nextSubBoard[squareIdx] = player;
        nextBoards[subBoardIdx] = nextSubBoard;

        const nextMove = history.length;
        const activeSubBoard = nextSubBoard.includes(null) ? squareIdx : null;

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