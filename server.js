// server.js
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // new user joined with a name
  socket.on('join', (username) => {
    socket.username = username || 'Anonymous';
    socket.broadcast.emit('system message', `${socket.username} joined the chat`);
  });

  // receive chat message from client and broadcast it
  socket.on('chat message', (msg) => {
    const payload = {
      id: socket.id,
      username: socket.username || 'Anonymous',
      message: msg,
      ts: new Date().toISOString()
    };
    io.emit('chat message', payload);
  });

  // handle disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    if (socket.username) {
      socket.broadcast.emit('system message', `${socket.username} left the chat`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
