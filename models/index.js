const sequelize = require("../config/db");
const User = require("./User");
const Opportunity = require("./Opportunity");
const Favorite = require("./Favorite");

(async () => {
  await sequelize.sync();
})();

module.exports = { User, Opportunity, Favorite };
