import sequelize from "./config/dbConfig.js";
import User from "./models/userModel.js";

const seedUsers = async () => {
  try {
    // 1. Connect to Database
    await sequelize.authenticate();
    console.log("✅ Connected to Database...");

    // 2. Sync Database (Ensure table exists)
    await sequelize.sync();

    // 3. Clear existing users (Optional: to prevent unique constraint errors)
    // Warning: This deletes all existing users!
    await User.destroy({ where: {}, truncate: true });
    console.log("🗑️  Cleared existing users.");

    // 4. Define User Data for each Role
    const users = [
      {
        userName: "super_admin",
        fullName: "Global Commander",
        email: "super@rescue.com",
        phoneNumber: "9999999999",
        password: "password123", // Will be hashed by model hook
        role: "super_admin",
        bloodGroup: "O+",
        location: {
          country: "India",
          state: "Delhi",
          city: "New Delhi",
          street: "Central Secretariat",
          pincode: "110001"
        }
      },
      {
        userName: "kerala_admin",
        fullName: "State Admin Kerala",
        email: "admin@kerala.com",
        phoneNumber: "9876543210",
        password: "password123",
        role: "admin",
        bloodGroup: "A+",
        location: {
          country: "India",
          state: "Kerala",
          city: "Thiruvananthapuram",
          street: "MG Road",
          pincode: "695001"
        }
      },
      {
        userName: "wayanad_manager",
        fullName: "District Manager Wayanad",
        email: "manager@wayanad.com",
        phoneNumber: "8888888888",
        password: "password123",
        role: "manager",
        bloodGroup: "B+",
        location: {
          country: "India",
          state: "Kerala",
          city: "Kalpetta",
          street: "Civil Station",
          pincode: "673121"
        }
      },
      {
        userName: "field_agent_01",
        fullName: "Rescue Agent 007",
        email: "agent@rescue.com",
        phoneNumber: "7777777777",
        password: "password123",
        role: "agent",
        bloodGroup: "AB+",
        location: {
          country: "India",
          state: "Kerala",
          city: "Kochi",
          street: "Fort Kochi",
          pincode: "682001"
        }
      },
      {
        userName: "rahul_civilian",
        fullName: "Rahul Dravid",
        email: "rahul@gmail.com",
        phoneNumber: "6666666666",
        password: "password123",
        role: "people",
        bloodGroup: "O-",
        location: {
          country: "India",
          state: "Karnataka",
          city: "Bangalore",
          street: "Indiranagar",
          pincode: "560038"
        }
      },
      {
        userName: "priya_donor",
        fullName: "Priya Varrier",
        email: "priya@gmail.com",
        phoneNumber: "5555555555",
        password: "password123",
        role: "people",
        bloodGroup: "A-",
        location: {
          country: "India",
          state: "Kerala",
          city: "Thrissur",
          street: "Round North",
          pincode: "680001"
        }
      }
    ];

    // 5. Insert Users Loop
    // We use a loop instead of bulkCreate to ensure the 'beforeCreate' hook runs for hashing passwords
    for (const user of users) {
      await User.create(user);
    }

    console.log(`🚀 Successfully seeded ${users.length} users with different roles!`);

  } catch (error) {
    console.error("❌ Seeding Failed:", error);
  } finally {
    // 6. Close Connection
    await sequelize.close();
    process.exit();
  }
};

// Run the function
seedUsers();