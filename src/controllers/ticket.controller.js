const classifyTicket = require("../services/classifier.service");

const healthCheck = (req, res) => {
  return res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
};

const sortTicket = (req, res, next) => {
  try {
    const result = classifyTicket(req.body);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  healthCheck,
  sortTicket,
};
