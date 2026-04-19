# LoRa Telemetry Predictive Dashboard 📡🚀

A high-performance, cyberpunk-themed geospatial dashboard designed to reconstruct fragmented LoRa telemetry data using predictive kinematic modeling.

## 🌟 Key Features
- **Predictive Middleware**: Intelligent data-processing layer that identifies broken JSON packets and extrapolates coordinates.
- **Cyberpunk Aesthetics**: Dark-mode Design System with neon accents, pulsing radar indicators, and glassmorphic telemetry panels.
- **Real-Time Simulation**: Built-in LoRa network simulator that stress-tests the engine with a 30% packet loss rate.
- **Interactive Mapping**: Leaflet-based geospatial visualization with "Verified" vs. "Estimated" node states.

## 🛠️ Tech Stack
- **Frontend**: React (Vite)
- **Logic**: Vanilla JavaScript (Kinematic Extrapolation Engine)
- **Styling**: Vanilla CSS (Custom Cyberpunk Design System)
- **Icons**: Lucide-React
- **Maps**: Leaflet.js

## 🚀 Deployment Steps (Render)

If you are using **Render.com** to host this project, follow these steps:

1. **New Static Site**: Click "New +" and select "Static Site".
2. **Connect Repository**: Select `Predictive-Electoral-Analytics` from your GitHub account.
3. **Configurations**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. **Deploy**: Click "Create Static Site".

## 🧠 How the "Brain" Works (Layman's Terms)
When the vehicle enters a "dead zone" or signal interference occurs:
1. The system catches the partial, broken data.
2. It looks at the vehicle's last 5 known positions.
3. It calculates the **Velocity** and **Direction**.
4. It "draws" a predicted path for the vehicle until the real signal returns.
5. These points are highlighted in **Yellow** so the operator knows they are estimates.
