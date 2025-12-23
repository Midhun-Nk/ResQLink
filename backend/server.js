import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import dbConfig from './config/dbConfig.js';
import dontaionRoute from './routes/dontaions.js';
import supportRoutes from './routes/supportRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
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

  // --- 🛠️ TEST MODE: SEND DUMMY CALICUT VICTIM ---
  // This triggers 3 seconds after you refresh your admin panel
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
      timestamp: new Date().toISOString()
    };

    // Emit to your admin panel (same event name as real alerts)
    socket.emit("alert_rescue_team", dummyData);
  }, 3000); 

  // --- LISTEN FOR REAL SOS ---
  socket.on("send_sos_alert", (data) => {
    console.log("🚨 REAL SOS ALERT RECEIVED!");
    console.log("👤 Victim:", data.userName);
    console.log("📍 Location:", data.location);

    // Broadcast to admin panel
    io.emit("alert_rescue_team", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/donations', dontaionRoute)
app.use('/api/v1/support-groups', supportRoutes);
app.use('/api/v1/help-requests', requestRoutes); // <--- NEW ROUTE
app.use('/api/resources', resourceRoutes); // <--- Register new route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 3. IMPORTANT: Listen on httpServer, NOT app
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});