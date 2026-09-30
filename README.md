# 🗑️ EcoRoute AI - Smart Waste Management Command Center (Hyderabad)

An IoT-driven, executive-grade full-stack Smart Waste Management System designed for real-time municipal waste monitoring, dynamic sensor telemetry processing, and automated route optimization across 25 strategic locations in Hyderabad, India.

---

## 🌟 Key Features

* **Interactive Glassmorphic Dashboard:** Built with Leaflet.js, customized dark tiles, real-time analytics, and search/filter capabilities.
* **Geospatial Route Optimization:** Uses MongoDB `$geoNear` aggregation pipeline to calculate the shortest pickup route for critical bins ($\ge 80\%$ fill level) from a central depot in Hyderabad.
* **IoT Sensor Telemetry Simulator:** Real-time distance measurement processing (ultrasonic sensor logic) updating fill percentages and bin statuses (`Empty`, `Normal`, `Nearly Full`, `Full`, `Overflow`).
* **Live Auto-Telemetry Feed:** Toggle switch that simulates live municipal IoT network data updates every 4 seconds.
* **Driver Dispatch Itinerary:** Converts generated route paths into a numbered step-by-step turn-by-turn collection list for driver vehicles.
* **One-Click Pickup Reset:** Interactive popups allowing operators to mark full bins as collected (`0%` fill level reset) in real-time.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Mongoose ODM, `2dsphere` Geospatial Indexing)
* **Frontend:** HTML5, CSS3 (Glassmorphism UI), JavaScript (ES6+), Leaflet.js Mapping Library
* **Icons & Fonts:** Font Awesome 6, Plus Jakarta Sans

---

## 📂 Project Directory Structure

```text
smart-waste-management/
├── models/
│   └── Bin.js               # Mongoose schema with GeoJSON Point indexing
├── routes/
│   └── binRoutes.js         # RESTful API endpoints & $geoNear route calculations
├── scripts/
│   └── seedBins.js          # Database seeder with 25 Hyderabad municipal locations
├── public/
│   └── index.html           # Full interactive command center dashboard UI
├── .env.example             # Template for environment variables
├── .gitignore               # Ignored files (node_modules, .env)
├── package.json             # Dependencies and scripts
├── server.js                # Express app entry point & MongoDB connection
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v16.x or higher)
* [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) or local MongoDB installation

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/smart-waste-management.git
   cd smart-waste-management
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your MongoDB Connection URI and Port:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smartwaste?retryWrites=true&w=majority
   PORT=5000
   ```

4. **Seed the Database:**
   Populate MongoDB with 25 seed bin locations across Hyderabad (Hitec City, Jubilee Hills, Charminar, Secunderabad, etc.):
   ```bash
   npm run seed
   ```

5. **Start the Application:**
   ```bash
   npm run dev
   ```

6. **Access the Dashboard:**
   Open your browser and navigate to `http://localhost:5000`.

---

## 📡 API Reference

### 1. Get All Bins
Retrieves a list of all monitored bins in the system.
* **URL:** `/api/bins`
* **Method:** `GET`
* **Response:**
  ```json
  [
    {
      "_id": "65f1a2b...",
      "binId": "HYD-BIN-101",
      "capacityCm": 100,
      "currentFillLevel": 95,
      "status": "Overflow",
      "location": {
        "type": "Point",
        "coordinates": [78.3728, 17.4435]
      }
    }
  ]
  ```

### 2. Process Sensor Telemetry
Simulates incoming IoT ultrasonic sensor distance readings and calculates current fill percentage.
* **URL:** `/api/bins/telemetry`
* **Method:** `POST`
* **Request Body:**
  ```json
  {
    "binId": "HYD-BIN-101",
    "rawDistanceCm": 10
  }
  ```

### 3. Generate Collection Route
Uses `$geoNear` to return an optimized pickup sequence starting from specified vehicle coordinates.
* **URL:** `/api/bins/route/generate?lng=78.4744&lat=17.3984`
* **Method:** `GET`
* **Response:**
  ```json
  {
    "totalPickups": 5,
    "route": [ ...array of critical bins ordered by distance ]
  }
  ```

### 4. Reset Bin (Mark as Collected)
Resets a bin's fill level to `0%` and updates status to `Empty`.
* **URL:** `/api/bins/:binId/reset`
* **Method:** `POST`

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.