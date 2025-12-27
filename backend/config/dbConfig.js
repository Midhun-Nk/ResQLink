import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// ==========================
// MySQL SSL (Base64, Render-safe)
// ==========================

const BASE_DIR = process.cwd();
const caBase64 = process.env.DB_SSL_CA_BASE64;

let sslOptions = false;

if (caBase64) {
  const caPath = path.join(BASE_DIR, "ca.pem");

  // Decode base64 and write cert only once
  if (!fs.existsSync(caPath)) {
    const caBuffer = Buffer.from(caBase64, "base64");
    fs.writeFileSync(caPath, caBuffer);
  }

  sslOptions = {
    require: true,
    rejectUnauthorized: true,
    ca: fs.readFileSync(caPath),
  };
}

// ==========================
// Sequelize config
// ==========================

const dbConfig = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    dialectOptions: sslOptions ? { ssl: sslOptions } : {},
  }
);

// ==========================
// Connect + Sync
// ==========================

(async () => {
  try {
    await dbConfig.authenticate();
    console.log("Database Connected Successfully ✔");

    await dbConfig.sync({ alter: false });
    console.log("Models synced successfully 🏁");
  } catch (error) {
    console.error("DB Connection Failed ❌:", error);
  }
})();

export default dbConfig;
