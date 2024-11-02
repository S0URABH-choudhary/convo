import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { fileURLToPath } from "node:url";
import { dirname , join } from "node:path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Setup HTTP and WebSocket server
const server = http.createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static("../frontend"))

// Basic route for testing
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/index.html'))
});
let users = {};

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  // handle connection
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    console.log(users)
    io.emit('user-list', users);
  })

  socket.on('disconnect',() => {
    if (users[socket.id]){
      io.emit('user-left',users[socket.id])
      delete users[socket.id];
      console.log(users)
      io.emit('user-list',users)
    }
  })
  // send message
  socket.on("message-send", message=>{
    socket.broadcast.emit("message-received", {message: message, name:users[socket.id]})
  });
});


server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
