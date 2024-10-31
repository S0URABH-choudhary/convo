import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from "node:url";
import { dirname , join } from "node:path";
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Setup HTTP and WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow connections from any origin (modify in production)
    methods: ["GET", "POST"]
  }
});
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.static("../frontend"))

// Basic route for testing
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/index.html'))
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on("new-user-joined", name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
    socket.on("message-send", message=>{
      socket.broadcast.emit("message-received", {message: message, name:users[socket.id]})
  })
  });
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Example of emitting a message to the client
  socket.emit('message', 'Hello from server!');

  // Handle message from the client
  socket.on('message', (data) => {
    console.log('Message from client:', data);
    io.emit('message', `Server received: ${data}`);
  });

  
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
