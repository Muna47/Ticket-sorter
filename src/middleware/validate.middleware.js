const ticketSchema = require("../validators/ticket.validator");

const validateTicket = (req, res, next) => {
  const { error } = ticketSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = validateTicket;
