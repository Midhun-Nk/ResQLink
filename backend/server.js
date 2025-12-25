import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

// Routes
import userRoutes from './routes/userRoutes.js';
import dbConfig from './config/dbConfig.js';
import dontaionRoute from './routes/dontaions.js';
import supportRoutes from './routes/supportRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';

const app = express(); 
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize DB
dbConfig; 

// 1. Create the HTTP Server
const httpServer = http.createServer(app);

// 2. Initialize Socket.io on the HTTP Server
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`⚡: User Connected: ${socket.id}`);

  // --- 🛠️ TEST MODE: SEND DUMMY CALICUT VICTIM ---
  // This simulates an alert 3 seconds after admin panel connects
  setTimeout(() => {
    console.log("⚠️ SIMULATING CALICUT SOS ALERT...");
    
    const dummyData = {
      userName: "Rahul (Test Victim)",
      contactNumber: "+91 98765 43210",
      location: {
        // Coordinates for Calicut (Kozhikode), Kerala
        lat: 11.2588, 
        lng: 75.7804,
        accuracy: 15 // meters
      },
      // NEW: Added sample voice note for testing admin UI
      message: "VOICE MSG: Trapped on second floor, water rising",
      voiceNote: "Trapped on second floor, water rising",
      timestamp: new Date().toISOString()
    };

    // Emit to your admin panel
    socket.emit("alert_rescue_team", dummyData);
  }, 3000); 

  // --- LISTEN FOR REAL SOS ---
  socket.on("send_sos_alert", (data) => {
    console.log("----------------------------------------");
    console.log("🚨 REAL SOS ALERT RECEIVED!");
    console.log("👤 Victim:", data.userName);
    console.log("📍 Location:", data.location);
    console.log("🎤 Voice Note:", data.voiceNote || "No voice message");
    console.log("----------------------------------------");

    // Broadcast to admin panel
    io.emit("alert_rescue_team", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Routes configuration
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/donations', dontaionRoute)
app.use('/api/v1/support-groups', supportRoutes);
app.use('/api/v1/help-requests', requestRoutes); 
app.use('/api/resources', resourceRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// 3. Listen on httpServer
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});