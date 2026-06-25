const Joi = require("joi");

const ticketSchema = Joi.object({
  ticket_id: Joi.string().trim().required(),

  channel: Joi.string()
    .valid("app", "sms", "call_center", "merchant_portal")
    .optional(),

  locale: Joi.string().valid("bn", "en", "mixed").optional(),

  message: Joi.string().trim().min(3).max(5000).required(),
});

module.exports = ticketSchema;
