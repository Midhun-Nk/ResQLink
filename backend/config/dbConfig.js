import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();  // load .env

// Load SSL Certificate
const caCertPath = process.env.DB_SSL_CA 
  ? path.join(process.cwd(), process.env.DB_SSL_CA) 
  : null;

const caCert = caCertPath ? fs.readFileSync(caCertPath) : null;

const dbConfig = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: caCert
        ? {
            require: true,
            rejectUnauthorized: true,
            ca: caCert,
          }
        : false,
    },
  }
);

// Connect + Sync
(async () => {
  try {
    await dbConfig.authenticate();
    console.log("Database Connected Successfully ✔");

    await dbConfig.sync({ alter: false });
    console.log("Models synced successfully 🏁");
  } catch (error) {
    console.error("DB Connection Failed ❌:", error.message);
  }
})();

export default dbConfig;
