import sequelize from "./config/dbConfig.js";
import SupportGroup from "./models/SupportGroup.js";
const seedGroups = async () => {
  try {
    // 1. Connect
    await sequelize.authenticate();
    console.log('✅ Connected to Database...');

    // 2. Sync (Ensure table exists)
    await sequelize.sync();

    // 3. Clear Old Data
    await SupportGroup.destroy({ where: {}, truncate: true });
    console.log('🗑️  Cleared existing support groups.');

    // 4. Define Mock Data (CORRECTED: specialties are now Arrays)
    const groups = [
      {
        name: "NCC 9(K) Naval Unit",
        type: "Uniformed Force",
        members: 45,
        location: "Kozhikode Beach",
        status: "Active",
        specialty: ["Crowd Control", "Flood Rescue", "Logistics"], // <--- Array
        contactNumber: "+91 94470 12345",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/NCC_flag.svg/1200px-NCC_flag.svg.png"
      },
      {
        name: "NSS Unit 102 - Farook College",
        type: "Student Volunteer",
        members: 120,
        location: "Feroke, Kozhikode",
        status: "Standby",
        specialty: ["Food Distribution", "Cleaning", "First Aid"], // <--- Array
        contactNumber: "+91 98460 67890",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/NSS-symbol.jpeg/800px-NSS-symbol.jpeg"
      },
      {
        name: "Coastal Warriors (Fishermen Army)",
        type: "Civilian Rescue",
        members: 30,
        location: "Beypore Harbour",
        status: "Deployed",
        specialty: ["Boat Rescue", "Deep Water Navigation", "Swimming"], // <--- Array
        contactNumber: "+91 99610 11223",
        image: "https://cdn-icons-png.flaticon.com/512/1995/1995562.png" 
      },
      {
        name: "IQRAA Emergency Trauma Unit",
        type: "Medical",
        members: 12,
        location: "Malaparamba, Calicut",
        status: "Active",
        specialty: ["Emergency Surgery", "Ambulance Service", "Triage"], // <--- Array
        contactNumber: "+91 495 237 9999",
        image: "https://cdn-icons-png.flaticon.com/512/3063/3063176.png" 
      },
      {
        name: "Red Cross Kerala Chapter",
        type: "Medical",
        members: 200,
        location: "Thiruvananthapuram HQ",
        status: "Active",
        specialty: ["Blood Donation", "Medical Camps", "Shelter Management"], // <--- Array
        contactNumber: "+91 471 230 5555",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_Red_Cross.svg/1024px-Flag_of_the_Red_Cross.svg.png"
      },
      {
        name: "Wayanad Jeep Rescue Team",
        type: "Civilian Rescue",
        members: 18,
        location: "Kalpetta, Wayanad",
        status: "Standby",
        specialty: ["Off-road Transport", "Hill Rescue", "Supply Chain"], // <--- Array
        contactNumber: "+91 97450 88776",
        image: "https://cdn-icons-png.flaticon.com/512/2318/2318469.png" 
      },
      {
        name: "Fire Force Volunteers",
        type: "Uniformed Force",
        members: 60,
        location: "Kannur District",
        status: "Deployed",
        specialty: ["Fire Fighting", "Debris Removal", "Chemical Safety"], // <--- Array
        contactNumber: "+91 101",
        image: null
      }
    ];

    // 5. Bulk Insert
    for (const group of groups) {
      await SupportGroup.create(group);
    }
    
    console.log(`🚀 Successfully seeded ${groups.length} support teams!`);

  } catch (error) {
    console.error('❌ Seeding Failed:', error);
  } finally {
    await sequelize.close();
    process.exit();
  }
};

seedGroups();
