const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: "No token" });
  const [, t] = h.split(" ");
  try {
    req.user = jwt.verify(t, process.env.JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
};
