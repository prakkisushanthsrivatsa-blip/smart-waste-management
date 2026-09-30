const mongoose = require("mongoose");

const binSchema = new mongoose.Schema(
    {
        binId: {
            type: String,
            required: true,
            unique: true
        },

        // GeoJSON standard required for MongoDB $geoNear & 2dsphere indexing
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number], // [longitude, latitude] - NOTE: Longitude comes FIRST in GeoJSON
                required: true
            }
        },

        capacityCm: {
            type: Number,
            required: true
        },

        currentFillLevel: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: ["Empty", "Normal", "Nearly Full", "Full", "Overflow"],
            default: "Empty"
        }
    },
    {
        timestamps: true
    }
);

// Create geospatial index for proximity queries
binSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Bin", binSchema);