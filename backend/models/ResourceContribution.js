import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import ResourceRequest from "./ResourceRequest.js"; // Import parent model

const ResourceContribution = sequelize.define('ResourceContribution', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  donorName: {
    type: DataTypes.STRING,
    defaultValue: 'Anonymous'
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Collected', 'Rejected'),
    defaultValue: 'Pending'
  },
  // Foreign Key
  resourceRequestId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

// Setup Associations
ResourceRequest.hasMany(ResourceContribution, { foreignKey: 'resourceRequestId' });
ResourceContribution.belongsTo(ResourceRequest, { foreignKey: 'resourceRequestId' });

export default ResourceContribution;