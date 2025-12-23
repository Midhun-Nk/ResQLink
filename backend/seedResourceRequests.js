import sequelize from "./config/dbConfig.js";
import ResourceRequest from "./models/ResourceRequest.js";
const seedResources = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Database...');
    
    // Sync table
    await sequelize.sync();

    // Optional: Clear existing data
    await ResourceRequest.destroy({ where: {}, truncate: true });
    console.log('🗑️  Cleared existing resource requests.');

    const initialRequests = [
      {
        item: "Blankets & Bedsheets",
        category: "Shelter",
        location: "Govt High School Camp, Wayanad",
        urgency: "Critical",
        required: 500,
        collected: 320,
        deadline: "24 Hours",
        description: "Urgent need for clean woolen blankets for elderly and children displaced by landslide."
      },
      {
        item: "Drinking Water (20L Cans)",
        category: "Food & Water",
        location: "Community Hall, Nilambur",
        urgency: "High",
        required: 200,
        collected: 45,
        deadline: "Immediate",
        description: "Clean drinking water supply cut off. Need sealed 20L cans."
      },
      {
        item: "Paracetamol & Dettol",
        category: "Medical",
        location: "Primary Health Center, District 4",
        urgency: "Normal",
        required: 1000,
        collected: 850,
        deadline: "3 Days",
        description: "Basic first aid kits and fever medication for flood victims."
      },
      {
        item: "Rice Bags (10kg)",
        category: "Food & Water",
        location: "Relief Base 2, Aluva",
        urgency: "High",
        required: 50,
        collected: 0,
        deadline: "48 Hours",
        description: "Matta rice needed for community kitchen serving 300 people."
      }
    ];

    await ResourceRequest.bulkCreate(initialRequests);
    console.log(`🚀 Successfully seeded ${initialRequests.length} resource requests!`);

  } catch (error) {
    console.error('❌ Seeding Failed:', error);
  } finally {
    await sequelize.close();
    process.exit();
  }
};

seedResources();