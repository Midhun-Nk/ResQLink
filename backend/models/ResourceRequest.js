import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const ResourceRequest = sequelize.define('ResourceRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  item: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Food & Water', 'Medical', 'Shelter', 'Clothing', 'Logistics'),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  urgency: {
    type: DataTypes.ENUM('Normal', 'High', 'Critical'),
    defaultValue: 'Normal'
  },
  required: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  collected: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  deadline: {
    type: DataTypes.STRING, // Storing as string like "48 Hours" for simplicity, or use DATE
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Active', 'Fulfilled', 'Expired'),
    defaultValue: 'Active'
  }
}, {
  timestamps: true
});

export default ResourceRequest;