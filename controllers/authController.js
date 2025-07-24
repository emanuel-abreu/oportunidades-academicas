const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const logger = require("../utils/logger");

function handleError(next, status, message) {
  const err = new Error(message);
  err.status = status;
  return next(err);
}

exports.register = async (req, res, next) => {
  try {
    const { role, name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ role, name, email, password: hash });
    logger.info("User registered", { userId: user.id });
    return res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return handleError(next, 409, "Email já cadastrado");
    }
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return handleError(next, 401, "Credenciais inválidas");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return handleError(next, 401, "Credenciais inválidas");

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    logger.info("User logged in", { userId: user.id });
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
};
