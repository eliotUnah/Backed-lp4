const Joi = require("joi");

const createMoodSchema = Joi.object({
  emoji: Joi.string().required(),
  note: Joi.string().max(200).allow(""),
  date: Joi.date().iso().required()
});

module.exports = { createMoodSchema };
