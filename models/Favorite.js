const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Opportunity = require("./Opportunity");

class Favorite extends Model {}
Favorite.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  },
  { sequelize, modelName: "favorite" }
);

User.belongsToMany(Opportunity, { through: Favorite, as: "favorited" });
Opportunity.belongsToMany(User, { through: Favorite, as: "fans" });
module.exports = Favorite;
