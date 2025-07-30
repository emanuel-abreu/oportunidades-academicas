const router = require("express").Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/auth");
const { body, query } = require("express-validator");
const validate = require("../middlewares/validate");
const ctl = require("../controllers/opportunityController");

const permit = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ error: "Forbidden" });
  next();
};

router.post(
  "/",
  auth,
  permit(["professor", "coordenador"]),
  [
    body("title").notEmpty(),
    body("type").isIn(["bolsa", "evento", "monitoria", "estagio", "pesquisa"]),
  ],
  validate,
  ctl.create
);
router.get("/favorites", auth, ctl.listFavorites);

router.get("/", ctl.list);
router.get("/:id", ctl.get);
router.put("/:id", auth, ctl.update);
router.delete("/:id", auth, ctl.remove);
router.post("/:id/favorite", auth, ctl.favorite);
router.delete("/:id/favorite", auth, ctl.unfavorite);

module.exports = router;
