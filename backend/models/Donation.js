import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  donorName: {
    type: DataTypes.STRING,
    defaultValue: 'Anonymous'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true // Null until payment is successful
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true
});

export default Donation;