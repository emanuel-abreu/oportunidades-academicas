const { User } = require("../models");
const logger = require("../utils/logger");
const { handleError } = require("./authController");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return handleError(next, 404, "Usuário não encontrado");
    return res.json(user);
  } catch (err) {
    return next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const fields = [
      "name",
      "course",
      "semester",
      "interests",
      "emailNotifications",
    ];
    await User.update(req.body, { where: { id: req.user.id }, fields });
    logger.info("Profile updated", { userId: req.user.id });
    return res.json({ message: "Perfil atualizado com sucesso" });
  } catch (err) {
    return next(err);
  }
};
