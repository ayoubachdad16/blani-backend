const express = require("express");
const router = express.Router();
const { createEvent } = require("../controllers/eventController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createEvent); // protégé

module.exports = router;
