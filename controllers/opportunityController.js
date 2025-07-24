const { Opportunity, User, Favorite } = require("../models");
const mailer = require("../utils/mailer");
const logger = require("../utils/logger");

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, creatorId: req.user.id };
    const opp = await Opportunity.create(data);

    const users = await User.findAll({ where: { emailNotifications: true } });
    users.forEach((u) => {
      mailer.sendMail({
        to: u.email,
        subject: "Nova oportunidade cadastrada",
        text: `Uma nova oportunidade "${opp.title}" foi publicada.`,
      });
    });
    logger.info("Opportunity created", { id: opp.id, creator: req.user.id });
    res.status(201).json(opp);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { search, type, area, sort } = req.query;
    const where = {};
    if (search)
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    if (type) where.type = type;
    if (area) where.area = area;
    const order = [];
    if (sort === "publishDate_desc") order.push(["publishDate", "DESC"]);
    if (sort === "deadline_asc") order.push(["deadline", "ASC"]);
    const list = await Opportunity.findAll({ where, order });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const opp = await Opportunity.findByPk(req.params.id, {
      include: ["creator"],
    });
    if (!opp) throw { status: 404, message: "Not found" };
    res.json(opp);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const opp = await Opportunity.findByPk(req.params.id);
    if (!opp) throw { status: 404 };
    if (opp.creatorId !== req.user.id) throw { status: 403 };
    await opp.update(req.body);
    logger.info("Opportunity updated", { id: opp.id });
    res.json(opp);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const opp = await Opportunity.findByPk(req.params.id);
    if (!opp) throw { status: 404 };
    if (opp.creatorId !== req.user.id) throw { status: 403 };
    await opp.destroy();
    logger.info("Opportunity deleted", { id: req.params.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

exports.favorite = async (req, res, next) => {
  try {
    const fav = await Favorite.findOrCreate({
      where: { userId: req.user.id, opportunityId: req.params.id },
    });
    res.json({ message: "Favorited" });
  } catch (err) {
    next(err);
  }
};

exports.unfavorite = async (req, res, next) => {
  try {
    await Favorite.destroy({
      where: { userId: req.user.id, opportunityId: req.params.id },
    });
    res.json({ message: "Unfavorited" });
  } catch (err) {
    next(err);
  }
};

exports.listFavorites = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { include: ["favorited"] });
    res.json(user.favorited);
  } catch (err) {
    next(err);
  }
};
