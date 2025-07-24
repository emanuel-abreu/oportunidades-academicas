const router = require("express").Router();
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");
const validate = require("../middlewares/validate");

router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["estudante", "professor", "coordenador"]),
  ],
  validate,
  register
);
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  validate,
  login
);
module.exports = router;
