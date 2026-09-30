require("dotenv").config();
const mongoose = require("mongoose");
const Bin = require("../models/Bin");

const sampleBins = [
  // Hitec City & IT Corridor
  { binId: "HYD-BIN-101", capacityCm: 100, currentFillLevel: 95, status: "Overflow", location: { type: "Point", coordinates: [78.3728, 17.4435] } }, // Cyber Towers
  { binId: "HYD-BIN-102", capacityCm: 100, currentFillLevel: 88, status: "Full", location: { type: "Point", coordinates: [78.3800, 17.4480] } }, // Mindspace
  { binId: "HYD-BIN-103", capacityCm: 100, currentFillLevel: 35, status: "Normal", location: { type: "Point", coordinates: [78.3610, 17.4580] } }, // Kondapur Junction
  { binId: "HYD-BIN-104", capacityCm: 100, currentFillLevel: 15, status: "Normal", location: { type: "Point", coordinates: [78.3560, 17.4400] } }, // Gachibowli DLF
  { binId: "HYD-BIN-105", capacityCm: 100, currentFillLevel: 92, status: "Overflow", location: { type: "Point", coordinates: [78.3910, 17.4380] } }, // Madhapur Metro

  // Jubilee & Banjara Hills
  { binId: "HYD-BIN-106", capacityCm: 100, currentFillLevel: 82, status: "Full", location: { type: "Point", coordinates: [78.4088, 17.4319] } }, // Jubilee Hills Checkpost
  { binId: "HYD-BIN-107", capacityCm: 100, currentFillLevel: 68, status: "Nearly Full", location: { type: "Point", coordinates: [78.4180, 17.4250] } }, // Road No 36
  { binId: "HYD-BIN-108", capacityCm: 100, currentFillLevel: 45, status: "Normal", location: { type: "Point", coordinates: [78.4350, 17.4150] } }, // Banjara Hills Rd 12
  { binId: "HYD-BIN-109", capacityCm: 100, currentFillLevel: 96, status: "Overflow", location: { type: "Point", coordinates: [78.4483, 17.4239] } }, // Punjagutta Circle
  { binId: "HYD-BIN-110", capacityCm: 100, currentFillLevel: 10, status: "Empty", location: { type: "Point", coordinates: [78.4520, 17.4330] } }, // Ameerpet Metro

  // Central & Old City
  { binId: "HYD-BIN-111", capacityCm: 100, currentFillLevel: 98, status: "Overflow", location: { type: "Point", coordinates: [78.4744, 17.3616] } }, // Charminar
  { binId: "HYD-BIN-112", capacityCm: 100, currentFillLevel: 85, status: "Full", location: { type: "Point", coordinates: [78.4710, 17.3700] } }, // High Court
  { binId: "HYD-BIN-113", capacityCm: 100, currentFillLevel: 55, status: "Normal", location: { type: "Point", coordinates: [78.4810, 17.3850] } }, // Koti Women's College
  { binId: "HYD-BIN-114", capacityCm: 100, currentFillLevel: 20, status: "Normal", location: { type: "Point", coordinates: [78.4680, 17.3980] } }, // Abids Circle
  { binId: "HYD-BIN-115", capacityCm: 100, currentFillLevel: 90, status: "Full", location: { type: "Point", coordinates: [78.4780, 17.4050] } }, // Nampally Station

  // Secunderabad & East
  { binId: "HYD-BIN-116", capacityCm: 100, currentFillLevel: 84, status: "Full", location: { type: "Point", coordinates: [78.4983, 17.4399] } }, // Secunderabad Station
  { binId: "HYD-BIN-117", capacityCm: 100, currentFillLevel: 62, status: "Nearly Full", location: { type: "Point", coordinates: [78.5020, 17.4500] } }, // Paradise Circle
  { binId: "HYD-BIN-118", capacityCm: 100, currentFillLevel: 30, status: "Normal", location: { type: "Point", coordinates: [78.4860, 17.4420] } }, // Begumpet Airport Road
  { binId: "HYD-BIN-119", capacityCm: 100, currentFillLevel: 91, status: "Overflow", location: { type: "Point", coordinates: [78.5280, 17.4010] } }, // Uppal Ring Road
  { binId: "HYD-BIN-120", capacityCm: 100, currentFillLevel: 0, status: "Empty", location: { type: "Point", coordinates: [78.5480, 17.4080] } }, // Nagole Metro

  // Kukatpally & North West
  { binId: "HYD-BIN-121", capacityCm: 100, currentFillLevel: 89, status: "Full", location: { type: "Point", coordinates: [78.4110, 17.4840] } }, // KPHB Colony
  { binId: "HYD-BIN-122", capacityCm: 100, currentFillLevel: 75, status: "Nearly Full", location: { type: "Point", coordinates: [78.4230, 17.4950] } }, // JNTU Campus
  { binId: "HYD-BIN-123", capacityCm: 100, currentFillLevel: 40, status: "Normal", location: { type: "Point", coordinates: [78.4410, 17.4720] } }, // Erragadda
  { binId: "HYD-BIN-124", capacityCm: 100, currentFillLevel: 94, status: "Overflow", location: { type: "Point", coordinates: [78.3480, 17.5020] } }, // Miyapur Bus Depot
  { binId: "HYD-BIN-125", capacityCm: 100, currentFillLevel: 12, status: "Normal", location: { type: "Point", coordinates: [78.3680, 17.4710] } }  // Hafeezpet
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    await Bin.deleteMany({});
    console.log("Existing bins cleared.");

    const createdBins = await Bin.insertMany(sampleBins);
    console.log(`Successfully seeded ${createdBins.length} Hyderabad bins!`);

    await Bin.createIndexes();
    console.log("Geospatial 2dsphere indexes verified.");

  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedDatabase();