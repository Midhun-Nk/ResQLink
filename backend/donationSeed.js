import sequelize from "./config/dbConfig.js";
import Donation from "./models/Donation.js";
// --- Configuration ---
const CLEAR_EXISTING = true; // Set to false if you want to keep old data
const TOTAL_ENTRIES = 50;    // How many donations to generate

// --- Helper Data ---
const names = [
  "Rahul Sharma", "Priya Patel", "Amit Verma", "Sneha Gupta", 
  "Vikram Singh", "Anjali Nair", "Mohammed Riaz", "David John", 
  "Kavita Krishnan", "Arjun Reddy", "Neha Kapoor", "Sandeep Malhotra",
  "Anonymous", "Anonymous", "Anonymous" // Weigh towards anonymous
];

// --- Helper: Random Date in last X days ---
const getRandomDate = (daysBack) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date;
};

// --- Helper: Random Amount (realistic tiers) ---
const getRandomAmount = () => {
  const tiers = [500, 1000, 2000, 5000, 10000, 500, 100, 2500];
  return tiers[Math.floor(Math.random() * tiers.length)];
};

const seedDatabase = async () => {
  try {
    // 1. Connect to DB
    await sequelize.authenticate();
    console.log('✅ Connected to Database for Seeding...');

    // 2. Sync Models (Ensure table exists)
    await sequelize.sync();

    // 3. Clear existing data (Optional)
    if (CLEAR_EXISTING) {
      await Donation.destroy({ where: {}, truncate: true });
      console.log('🗑️  Cleared existing donation data.');
    }

    // 4. Generate Mock Data
    const mockData = [];
    for (let i = 0; i < TOTAL_ENTRIES; i++) {
      const isSuccess = Math.random() > 0.1; // 90% success rate
      const date = getRandomDate(10); // Spread over last 10 days
      
      mockData.push({
        donorName: names[Math.floor(Math.random() * names.length)],
        amount: getRandomAmount(),
        orderId: `order_seed_${Date.now()}_${i}`, // Fake Razorpay Order ID
        paymentId: isSuccess ? `pay_seed_${Date.now()}_${i}` : null,
        status: isSuccess ? 'success' : 'failed',
        createdAt: date,
        updatedAt: date
      });
    }

    // 5. Bulk Insert
    await Donation.bulkCreate(mockData);
    console.log(`🌱 Successfully seeded ${mockData.length} donations!`);

    // 6. Calculate Stats Preview
    const total = mockData
        .filter(d => d.status === 'success')
        .reduce((acc, curr) => acc + curr.amount, 0);
    
    console.log(`💰 Total Mock Fund Raised: ₹${total.toLocaleString()}`);

  } catch (error) {
    console.error('❌ Seeding Failed:', error);
  } finally {
    // 7. Close Connection
    await sequelize.close();
    process.exit();
  }
};

// Run the function
seedDatabase();