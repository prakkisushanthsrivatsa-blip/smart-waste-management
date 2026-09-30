const express = require("express");
const Bin = require("../models/Bin");

const router = express.Router();

// Helper function to calculate status from fill percentage
function getStatus(fillPercentage) {
    if (fillPercentage >= 95) return "Overflow";
    if (fillPercentage >= 80) return "Full";
    if (fillPercentage >= 60) return "Nearly Full";
    if (fillPercentage > 10) return "Normal";
    return "Empty";
}

// 1. Get all bins -> GET /api/bins
router.get("/", async (req, res) => {
    try {
        const bins = await Bin.find();
        res.json(bins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. Add a new bin -> POST /api/bins
router.post("/", async (req, res) => {
    try {
        const { binId, latitude, longitude, capacityCm } = req.body;

        const bin = new Bin({
            binId,
            capacityCm,
            location: {
                type: "Point",
                coordinates: [longitude, latitude] // GeoJSON format: [lng, lat]
            }
        });

        const savedBin = await bin.save();
        res.status(201).json(savedBin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 3. Sensor Telemetry Endpoint -> POST /api/bins/telemetry
router.post("/telemetry", async (req, res) => {
    try {
        const { binId, rawDistanceCm } = req.body;

        const bin = await Bin.findOne({ binId });
        if (!bin) {
            return res.status(404).json({ message: `Bin ${binId} not found` });
        }

        // Calculate fill percentage (less distance = more full)
        const measuredSpace = Math.min(Math.max(rawDistanceCm, 0), bin.capacityCm);
        const fillLevel = Math.round(((bin.capacityCm - measuredSpace) / bin.capacityCm) * 100);
        const status = getStatus(fillLevel);

        bin.currentFillLevel = fillLevel;
        bin.status = status;
        await bin.save();

        res.json({ success: true, bin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. Generate Optimized Collection Route -> GET /api/bins/route/generate
router.get("/route/generate", async (req, res) => {
    try {
        const longitude = parseFloat(req.query.lng);
        const latitude = parseFloat(req.query.lat);

        if (isNaN(longitude) || isNaN(latitude)) {
            return res.status(400).json({ message: "Valid 'lng' and 'lat' query parameters are required" });
        }

        const pickupRoute = await Bin.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [longitude, latitude] },
                    distanceField: "distanceMeters",
                    query: { currentFillLevel: { $gte: 80 } },
                    spherical: true
                }
            },
            { $sort: { currentFillLevel: -1, distanceMeters: 1 } }
        ]);

        res.json({ totalPickups: pickupRoute.length, route: pickupRoute });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 5. Reset/Empty Bin -> POST /api/bins/:binId/reset
router.post("/:binId/reset", async (req, res) => {
    try {
        const bin = await Bin.findOneAndUpdate(
            { binId: req.params.binId },
            { currentFillLevel: 0, status: "Empty" },
            { new: true }
        );

        if (!bin) {
            return res.status(404).json({ message: "Bin not found" });
        }

        res.json({ message: "Bin emptied successfully", bin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;