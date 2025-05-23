import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

// used to store typing users
const typingUserMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // for typing users
  io.emit("getTypingUsers", Object.keys(typingUserMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // for typing event
  socket.on("typing", (data) => {
    const userId = socket.handshake.query.userId;
    
    if (!userId) return;

    const { isTyping } = data;
    if (isTyping) {
      typingUserMap[userId] = socket.id;
    } else {
      delete typingUserMap[userId];
    }

    io.emit("getTypingUsers", Object.keys(typingUserMap));
  });

  // Make the Channel members to join this room
  socket.on('joinChannel', (data) => {
    const { channelId } = data;

    const roomName = `channel_${channelId}`;
    socket.join(roomName);

    console.log(`(${socket.id}) joined ${roomName}`);

    // // Optional: notify others in the room
    // socket.to(roomName).emit('userJoined', {
    //   userId,
    //   socketId: socket.id,
    //   message: `${userId} joined the channel.`,
    // });
  });

  // Make the Channel members to leave this room
  socket.on('leaveChannel', (data) => {
    const { channelId } = data;
    const roomName = `channel_${channelId}`;
  
    socket.leave(roomName);
  
    console.log(`(${socket.id}) left ${roomName}`);
  
    // // Optional: notify others in the room
    // socket.to(roomName).emit('userLeft', {
    //   username,
    //   socketId: socket.id,
    //   message: `${username} left the channel.`,
    // });
  });
});

export { io, app, server };
