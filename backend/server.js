import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import dbConfig from './config/dbConfig.js';
import http from 'http';
import { Server } from 'socket.io';

const app = express(); // Renamed 'server' to 'app' for standard convention
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Trigger DB Config (assuming it's a side-effect import or needs calling)
// If dbConfig is a function, call it like: dbConfig();
dbConfig; 

// 1. Create the HTTP Server
const httpServer = http.createServer(app);

// 2. Initialize Socket.io on the HTTP Server
const io = new Server(httpServer, {
  cors: {
    // allowing all origins for development to avoid CORS errors
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`⚡: User Connected: ${socket.id}`);

  // --- LISTEN FOR SOS ---
  socket.on("send_sos_alert", (data) => {
    console.log("🚨 SOS ALERT RECEIVED!");
    console.log("👤 Victim:", data.userName);
    console.log("📍 Location:", data.location);

    // --- BROADCAST TO ADMIN PANEL ---
    io.emit("alert_rescue_team", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.use('/api/v1/auth', userRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// 3. IMPORTANT: Listen on httpServer, NOT app
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});