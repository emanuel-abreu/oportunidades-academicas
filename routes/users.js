const router = require("express").Router();
const { getProfile, updateProfile } = require("../controllers/userController");
const auth = require("../middlewares/auth");
const { body } = require("express-validator");
const validate = require("../middlewares/validate");

router.get("/me", auth, getProfile);
router.put(
  "/me",
  auth,
  [
    body("name").optional().isString(),
    body("course").optional().isString(),
    body("semester").optional().isInt(),
    body("interests").optional().isArray(),
  ],
  validate,
  updateProfile
);

router.put(
  "/me/notifications",
  auth,
  [body("emailNotifications").isBoolean()],
  validate,
  async (req, res, next) => {
    try {
      await User.update(
        { emailNotifications: req.body.emailNotifications },
        { where: { id: req.user.id } }
      );
      res.json({ message: "Notificação atualizada" });
    } catch (e) {
      next(e);
    }
  }
);
module.exports = router;
