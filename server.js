const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname)));

const rooms = {};

// Generates a random 4-character room code (e.g. "XK9P")
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  do {
    code = '';
    for(let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (rooms[code]);
  return code;
}

io.on('connection', (socket) => {
  
  // Host creates a new room
  socket.on('createRoom', () => {
    const roomId = generateRoomCode();
    rooms[roomId] = { players: [socket.id], finished: 0 };
    socket.join(roomId);
    socket.emit('roomCreated', roomId);
  });

  // Guest joins an existing room
  socket.on('joinRoom', (roomId) => {
    roomId = roomId.toUpperCase();
    
    if (!rooms[roomId]) {
      socket.emit('roomError', 'Session not found. Check the code.');
      return;
    }
    if (rooms[roomId].players.length >= 2) {
      socket.emit('roomError', 'Session is already full!');
      return;
    }

    rooms[roomId].players.push(socket.id);
    socket.join(roomId);
    
    // Start the game for both players
    io.to(roomId).emit('startGame');
  });

  socket.on('finishGame', (data) => {
    const { roomId, score } = data;
    if (rooms[roomId]) {
      rooms[roomId].finished++;
      rooms[roomId][socket.id] = score;

      if (rooms[roomId].finished === 2) {
        const [p1, p2] = rooms[roomId].players;
        const score1 = rooms[roomId][p1];
        const score2 = rooms[roomId][p2];

        if (score1 > score2) {
          io.to(p1).emit('gameResult', { status: 'win', myScore: score1, opScore: score2 });
          io.to(p2).emit('gameResult', { status: 'lose', myScore: score2, opScore: score1 });
        } else if (score2 > score1) {
          io.to(p2).emit('gameResult', { status: 'win', myScore: score2, opScore: score1 });
          io.to(p1).emit('gameResult', { status: 'lose', myScore: score1, opScore: score2 });
        } else {
          io.to(roomId).emit('gameResult', { status: 'tie', myScore: score1, opScore: score2 });
        }
        
        delete rooms[roomId];
      }
    }
  });

  // Handle a player leaving midway
  socket.on('disconnect', () => {
    for (const [roomId, room] of Object.entries(rooms)) {
      if (room.players.includes(socket.id)) {
        room.players = room.players.filter(id => id !== socket.id);
        if (room.players.length === 0) {
          delete rooms[roomId];
        } else {
          io.to(roomId).emit('opponentLeft');
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});