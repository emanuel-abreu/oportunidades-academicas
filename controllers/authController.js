const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const logger = require("../utils/logger");

exports.register = async (req, res, next) => {
  try {
    const { role, name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ role, name, email, password: hash });
    logger.info("User registered", { userId: user.id });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) throw { status: 401, message: "Invalid credentials" };
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw { status: 401, message: "Invalid credentials" };
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    logger.info("User logged in", { userId: user.id });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
