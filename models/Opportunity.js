const { DataTypes, Model } = require("sequelize");
const { Op } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

class Opportunity extends Model {}
Opportunity.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM(
        "bolsa",
        "evento",
        "monitoria",
        "estagio",
        "pesquisa"
      ),
      allowNull: false,
    },
    area: DataTypes.STRING,
    publishDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    deadline: DataTypes.DATE,
  },
  { sequelize, modelName: "opportunity" }
);
Opportunity.belongsTo(User, { as: "creator", foreignKey: "creatorId" });
module.exports = Opportunity;
