import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import OpenAI from 'openai'; // 👈 CHANGED: Standard SDK for OpenRouter

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

// --- 🔑 OPENROUTER CONFIGURATION ---
// 1. Get your key from: https://openrouter.ai/keys
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = "http://localhost:3000"; // Optional: Your site URL for rankings
const SITE_NAME = "RescueOps"; // Optional: Your site name

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": SITE_URL,
    "X-Title": SITE_NAME,
  }
});

// --- 🛡️ STATIC FALLBACK ADVICE (Reliability Layer) ---
// If OpenRouter fails (no internet/rate limit), we use this immediately.
const STATIC_ADVICE = {
    "fire": "1. Evacuate immediately via stairs (no elevators). 2. Stay low if there is smoke. 3. Call Fire Services.",
    "medical": "1. Check responsiveness and breathing. 2. Perform CPR if trained and necessary. 3. Do not move the person unless in danger.",
    "flood": "1. Move to higher ground immediately. 2. Do not walk or drive through moving water. 3. Disconnect electrical appliances.",
    "earthquake": "1. Drop, Cover, and Hold On. 2. Stay away from windows and glass. 3. If outside, stay away from buildings/trees.",
    "accident": "1. Ensure your own safety first. 2. Do not move injured victims. 3. Set up warning triangles if available.",
    "general": "1. Stay calm and assess the surroundings. 2. Move to a safe location. 3. Contact local authorities."
};

// Emergency Numbers Mapping
const RESCUE_LOOKUP = {
    "fire": { name: "Fire Service", phone: "101" },
    "medical": { name: "Ambulance", phone: "102" },
    "police": { name: "Police", phone: "100" },
    "accident": { name: "Highway Patrol", phone: "1033" },
    "flood": { name: "Disaster Force", phone: "108" },
    "earthquake": { name: "Disaster Force", phone: "108" },
    "general": { name: "Emergency Helpline", phone: "112" }
};

const KEYWORD_MAP = {
    "fire": ["fire", "flames", "smoke", "burning", "explosion"],
    "medical": ["blood", "hurt", "pain", "unconscious", "heart", "breathing", "injured"],
    "flood": ["water", "flood", "drowning", "river", "rain", "submerged"],
    "accident": ["crash", "car", "hit", "collision", "accident"],
    "earthquake": ["shake", "shaking", "collapse", "ground", "tremor"],
};


// --- HELPER FUNCTIONS ---

const analyzeText = (text) => {
    const lowerText = text.toLowerCase();
    
    // 1. Detect Intent
    let detectedIntent = "general";
    for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
        if (keywords.some(word => lowerText.includes(word))) {
            detectedIntent = category;
            break; 
        }
    }
    return { intent: detectedIntent };
};

const generateAdvice = async (text, intent) => {
    // 1. Try OpenRouter API
    try {
        const completion = await openai.chat.completions.create({
            // BEST FREE MODEL: Google Gemini 2.0 Flash (via OpenRouter)
            model: "google/gemini-2.0-flash-exp:free", 
            messages: [
              {
                role: "system",
                content: "You are an emergency response expert. Provide exactly 3 concise, actionable safety steps for the victim to do RIGHT NOW. Do not use markdown formatting (no bolding). Do not include any intro text like 'Here are the steps'. Just the numbered list."
              },
              {
                role: "user",
                content: `Emergency Type: ${intent}. Situation: ${text}`
              }
            ],
            temperature: 0.3, // Low temp for more reliable/safe answers
            max_tokens: 150,
        });

        const advice = completion.choices[0].message.content;
        console.log("💎 OpenRouter AI Output:", advice);
        
        // Safety check: ensure we got a real response
        if (!advice || advice.length < 10) throw new Error("Empty AI response");

        return advice;

    } catch (e) {
        console.error("❌ OpenRouter API Failed (Using Fallback):", e.message);
        // 2. Fallback to Static Data if API fails
        return STATIC_ADVICE[intent] || STATIC_ADVICE["general"];
    }
};


// --- SERVER SETUP ---
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
    console.log(`⚡: User Connected: ${socket.id}`);

    // --- 🛠️ TEST MODE ---
    setTimeout(() => {
        const dummyData = {
            userName: "Rahul (Test Victim)",
            contactNumber: "+91 98765 43210",
            location: { lat: 11.2588, lng: 75.7804, accuracy: 15 },
            message: "VOICE MSG: Big fire near the petrol pump",
            voiceNote: "Big fire near the petrol pump",
            timestamp: new Date().toISOString()
        };
        processAlert(dummyData).then(enriched => {
            console.log("⚠️ SENDING SIMULATED ALERT");
            socket.emit("alert_rescue_team", enriched);
            
            socket.emit("sos_acknowledged", {
                message: "Alert Received! Help is coming.",
                advice: enriched.aiAnalysis.ai_advice,
                contact: enriched.aiAnalysis.emergency_contact
            });
        });
    }, 4000);

    // --- 🚨 LISTEN FOR REAL SOS ---
    socket.on("send_sos_alert", async (data) => {
        console.log("🚨 SOS RECEIVED. Processing...");
        
        // Process the alert (Analysis + AI)
        const enrichedData = await processAlert(data);

        // 1. Broadcast to Admin Panel
        io.emit("alert_rescue_team", enrichedData);

        // 2. Send Advice back to Victim
        console.log("📤 Sending advice back to client...");
        socket.emit("sos_acknowledged", {
            message: "Alert Received! Help is coming.",
            advice: enrichedData.aiAnalysis.ai_advice,
            contact: enrichedData.aiAnalysis.emergency_contact
        });
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

// Wrapper Logic
async function processAlert(data) {
    let aiResult = {
        category: "general",
        emergency_contact: RESCUE_LOOKUP["general"],
        ai_advice: STATIC_ADVICE["general"] 
    };

    if (data.voiceNote) {
        const { intent } = analyzeText(data.voiceNote);
        const contact = RESCUE_LOOKUP[intent] || RESCUE_LOOKUP["general"];
        
        // Generate advice (OpenRouter or Fallback)
        const advice = await generateAdvice(data.voiceNote, intent);

        aiResult = {
            category: intent,
            emergency_contact: contact,
            ai_advice: advice
        };
    }

    return {
        ...data,
        aiAnalysis: aiResult
    };
}

// Routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/donations', dontaionRoute)
app.use('/api/v1/support-groups', supportRoutes);
app.use('/api/v1/help-requests', requestRoutes); 
app.use('/api/resources', resourceRoutes);

app.get('/', (req, res) => {
    res.send('Node.js AI Server Running...');
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});