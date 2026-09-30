const dns = require("dns");
dns.setDefaultResultOrder("ipv4first"); // Forces Node to prefer IPv4 over IPv6

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const binRoutes = require("./routes/binRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// 1. Serve static frontend files from public directory
app.use(express.static(path.join(__dirname, "public")));

// 2. API Routes
app.use("/api/bins", binRoutes);

// 3. Health check / status route for explicit API verification
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Smart Waste Management API is running" });
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });