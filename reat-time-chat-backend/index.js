const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// User tracking
const onlineUsers = {};       // socket.id → username
const userSocketMap = {};     // username → socket.id

io.on('connection', (socket) => {
  console.log('🟢 A user connected:', socket.id);

  // User Registration
  socket.on('register_user', (username) => {
    onlineUsers[socket.id] = username;
    userSocketMap[username] = socket.id;
    io.emit('update_users', Object.keys(userSocketMap));
  });

  // Public chat
  socket.on('send_message', (data) => {
    socket.broadcast.emit('receive_message', data);
  });

  // Typing indicators
  socket.on('user_typing', ({ username }) => {
    socket.broadcast.emit('user_typing', { username });
  });

  socket.on('stop_typing', () => {
    socket.broadcast.emit('stop_typing');
  });

  // Private messaging
  socket.on('private_message', ({ recipient, sender, message }) => {
    const targetSocketId = userSocketMap[recipient];
    if (targetSocketId) {
      io.to(targetSocketId).emit('receive_private_message', {
        sender,
        message,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  });

  // Room support (for upcoming features)
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });


  socket.on('send_room_message', ({ room, sender, message }) => {
    io.to(room).emit('receive_room_message', {
      sender,
      message,
      timestamp: new Date().toLocaleTimeString(),
      room,
    });
  });

  // Disconnection cleanup
  socket.on('disconnect', () => {
    const username = onlineUsers[socket.id];
    delete onlineUsers[socket.id];
    if (username) delete userSocketMap[username];
    io.emit('update_users', Object.keys(userSocketMap));
    console.log('🔴 A user disconnected:', socket.id);
  });

  socket.on('join_room', (room) => {
  socket.join(room);
  socket.room = room; // track room on socket
  console.log(`User ${socket.id} joined room: ${room}`);

  // Notify others & update list
  const usersInRoom = [];
  const socketsInRoom = io.sockets.adapter.rooms.get(room) || [];

  for (let id of socketsInRoom) {
    const user = onlineUsers[id];
    if (user) usersInRoom.push(user);
  }

  io.to(room).emit('room_users_update', usersInRoom);
});

socket.on('leave_room', (room) => {
  socket.leave(room);
  console.log(`User ${socket.id} left room: ${room}`);

  const socketsInRoom = io.sockets.adapter.rooms.get(room) || [];
  const usersInRoom = [];

  for (let id of socketsInRoom) {
    const user = onlineUsers[id];
    if (user) usersInRoom.push(user);
  }

  io.to(room).emit('room_users_update', usersInRoom);
});

});

server.listen(3001, () => {
  console.log('✅ Server is running on http://localhost:3001');
});
