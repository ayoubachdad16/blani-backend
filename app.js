const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

module.exports = app;
const eventRoutes = require("./routes/eventRoutes");
app.use("/api/events", eventRoutes);
const friendRoutes = require("./routes/friendRoutes");
app.use("/api/friends", friendRoutes);
const groupRoutes = require("./routes/groupRoutes");
app.use("/api/groups", groupRoutes);


