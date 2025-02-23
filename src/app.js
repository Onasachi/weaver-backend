// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/database");
const { errorHandler } = require("./middleware/errorHandler");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware

app.use(helmet());
app.use(cors());
app.use(express.json());
// Database connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB:", err));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    // 15 minutes max: 100
    // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Basic test route
app.get("/", (req, res) => {
    res.send("Weaver API is running");
});

const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/organizations", require("./routes/organizationRoutes"));
app.use("/api/reputation", require("./routes/reputationRoutes"));
app.use("/api/nfts", require("./routes/nftRoutes"));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
