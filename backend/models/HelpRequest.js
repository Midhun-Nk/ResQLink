import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import SupportGroup from './SupportGroup.js';

const HelpRequest = sequelize.define('HelpRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  requesterName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false
  },
  urgency: {
    type: DataTypes.ENUM('Normal', 'Urgent', 'Critical'),
    defaultValue: 'Normal'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Resolved'),
    defaultValue: 'Pending'
  },
  // We will link this to a Support Group ID
  supportGroupId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

// Define Relationship: A Request belongs to a Support Group
HelpRequest.belongsTo(SupportGroup, { foreignKey: 'supportGroupId' });
SupportGroup.hasMany(HelpRequest, { foreignKey: 'supportGroupId' });

export default HelpRequest;