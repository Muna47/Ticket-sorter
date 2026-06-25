const express = require("express");

const router = express.Router();

const { healthCheck, sortTicket } = require("../controllers/ticket.controller");

const validateTicket = require("../middleware/validate.middleware");

router.get("/health", healthCheck);

router.post("/sort-ticket", validateTicket, sortTicket);

module.exports = router;
