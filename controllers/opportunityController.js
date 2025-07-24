const { Op } = require("sequelize");
const { Opportunity, User, Favorite } = require("../models");
const mailer = require("../utils/mailer");
const logger = require("../utils/logger");

function handleError(next, status, message) {
  const err = new Error(message);
  err.status = status;
  return next(err);
}

exports.create = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.create({
      ...req.body,
      creatorId: req.user.id,
    });
    logger.info("Opportunity created", {
      id: opportunity.id,
      creator: req.user.id,
    });

    const subscribers = await User.findAll({
      where: { emailNotifications: true },
    });
    for (const user of subscribers) {
      await mailer.sendMail({
        to: user.email,
        subject: "Nova oportunidade cadastrada",
        text: `Olá ${user.name},

Uma nova oportunidade "${opportunity.title}" foi publicada em ${new Date(
          opportunity.publishDate
        ).toLocaleDateString()}.

Acesse para saber mais!`,
      });
    }

    return res.status(201).json(opportunity);
  } catch (err) {
    return next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { search, type, area, sort } = req.query;
    const filters = {};
    if (search)
      filters[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    if (type) filters.type = type;
    if (area) filters.area = area;

    const order = [];
    if (sort) {
      const [field, dir] = sort.split("_");
      order.push([field, dir.toUpperCase()]);
    }

    const opportunities = await Opportunity.findAll({ where: filters, order });
    return res.json(opportunities);
  } catch (err) {
    return next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findByPk(req.params.id, {
      include: ["creator"],
    });
    if (!opportunity)
      return handleError(next, 404, "Oportunidade não encontrada");
    return res.json(opportunity);
  } catch (err) {
    return next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findByPk(req.params.id);
    if (!opportunity)
      return handleError(next, 404, "Oportunidade não encontrada");
    if (opportunity.creatorId !== req.user.id) {
      return handleError(next, 403, "Você não pode editar esta oportunidade");
    }

    await opportunity.update(req.body);
    logger.info("Opportunity updated", { id: opportunity.id });
    return res.json(opportunity);
  } catch (err) {
    return next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findByPk(req.params.id);
    if (!opportunity)
      return handleError(next, 404, "Oportunidade não encontrada");
    if (opportunity.creatorId !== req.user.id) {
      return handleError(next, 403, "Você não pode excluir esta oportunidade");
    }

    await opportunity.destroy();
    logger.info("Opportunity deleted", { id: req.params.id });
    return res.json({ message: "Oportunidade excluída com sucesso" });
  } catch (err) {
    return next(err);
  }
};

exports.favorite = async (req, res, next) => {
  try {
    await Favorite.findOrCreate({
      where: { userId: req.user.id, opportunityId: req.params.id },
    });
    return res.json({ message: "Oportunidade adicionada aos favoritos" });
  } catch (err) {
    return next(err);
  }
};

exports.unfavorite = async (req, res, next) => {
  try {
    await Favorite.destroy({
      where: { userId: req.user.id, opportunityId: req.params.id },
    });
    return res.json({ message: "Oportunidade removida dos favoritos" });
  } catch (err) {
    return next(err);
  }
};

exports.listFavorites = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { include: ["favorited"] });
    return res.json(user.favorited);
  } catch (err) {
    return next(err);
  }
};
