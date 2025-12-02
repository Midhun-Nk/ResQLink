import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import bcrypt from "bcrypt";

const User = sequelize.define("User", {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { len: [3, 50] }
  },

  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [3, 100] }
  },

  profile: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },

  phoneNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
    validate: { len: [10, 15] }
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [6, 255] }
  },

  role: {
    type: DataTypes.ENUM("super_admin", "admin", "manager", "agent", "people"),
    allowNull: false,
    defaultValue: "people"
  },

  bloodGroup: {
    type: DataTypes.ENUM("O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"),
    allowNull: true,
  },

  // ⭐ ALL LOCATION RELATED DATA INSIDE ONE JSON
  location: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      country: "",
      state: "",
      city: "",
      street: "",
      pincode: ""
    }
  }

}, {
  timestamps: true,
  tableName: "users",
  underscored: true
});


// 🔐 Auto-Hash Password Before Save
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

export default User;
