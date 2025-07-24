const { User } = require("../models");
const logger = require("../utils/logger");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const fields = ["name", "course", "semester", "interests"];
    await User.update(req.body, { where: { id: req.user.id }, fields });
    logger.info("Profile updated", { userId: req.user.id });
    res.json({ message: "Profile updated" });
  } catch (err) {
    next(err);
  }
};
