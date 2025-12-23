import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const SupportGroup = sequelize.define('SupportGroup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Uniformed Force', 'Student Volunteer', 'Civilian Rescue', 'Medical'),
    allowNull: false
  },
  members: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Active', 'Standby', 'Deployed', 'Inactive'),
    defaultValue: 'Active'
  },
  specialty: {
    type: DataTypes.STRING, // Stored as comma-separated string e.g., "Rescue,First Aid"
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('specialty');
      return rawValue ? rawValue.split(',') : [];
    },
    set(val) {
      this.setDataValue('specialty', val.join(','));
    }
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING, // URL to image
    allowNull: true
  }
}, {
  timestamps: true
});

export default SupportGroup;