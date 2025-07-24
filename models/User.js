const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM("estudante", "professor", "coordenador"),
      allowNull: false,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    course: DataTypes.STRING,
    semester: DataTypes.INTEGER,
    interests: DataTypes.ARRAY(DataTypes.STRING),
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  { sequelize, modelName: "user" }
);

module.exports = User;
