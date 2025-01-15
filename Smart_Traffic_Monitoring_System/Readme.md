
# Smart Traffic Monitoring System

## Overview
The Smart Traffic Monitoring System is a web-based application designed to provide real-time traffic data and analysis to help users navigate congested areas and optimize their routes. The system integrates geolocation tracking, real-time traffic monitoring, suspicious activity detection, and efficient traffic flow analysis using a variety of open-source APIs and custom algorithms.

This project aims to improve traffic management and enhance user experience by providing accurate, real-time data through a user-friendly interface.

## Features
- **Real-Time Traffic Monitoring**: Users can monitor traffic conditions on their selected route.
- **Geolocation Tracking**: Display user location on a map and provide directions.
- **Suspicious Activity Detection**: Detect suspicious activities by analyzing traffic data.
- **Autocomplete Search for Destinations**: Users can search for destinations with autocomplete suggestions powered by OpenStreetMap.
- **Traffic Alerts**: Alert users about high-traffic routes with a clear warning message.
- **Responsive Design**: The app is optimized for both desktop and mobile users.

## Installation
Follow these steps to set up and run the project locally:

### Prerequisites
- **Node.js** (v14.0.0 or higher)
- **npm** (Node Package Manager)
- **MongoDB** (for suspicious activity detection)

### Steps to Install
2. Navigate to the project directory:
    ```bash
    cd smart-traffic-monitoring-system
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Set up MongoDB:
    - Ensure MongoDB is installed and running on your system, or use a cloud MongoDB service (e.g., MongoDB Atlas).
    - Set up the MongoDB URI in the environment configuration (e.g., `.env`).

5. Start the application:
    ```bash
    npm start
    ```

6. Open your browser and navigate to `http://localhost:3000` to access the Smart Traffic Monitoring System.

## Technologies Used
- **Frontend**: 
  - HTML, CSS, JavaScript (ES6+)
  - Leaflet.js (for map rendering and geolocation)
  - Tailwind CSS (for styling)
  - GSAP (for animations)
  
- **Backend**:
  - Node.js
  - Express.js (for server-side routing)
  - MongoDB (for data storage and activity detection)

- **APIs**:
  - **OpenStreetMap** (for location search and autocomplete suggestions)
  - **OpenRouteService** (for route calculation and directions)

## Project Structure
```
smart-traffic-monitoring-system/
│
├── public/                    # Public files (images, icons, etc.)
├── src/
│   ├── components/            # React components
│   ├── services/              # API services and helpers
│   ├── styles/                # Tailwind CSS configuration
│   └── App.js                 # Main application component
├── server/                    # Backend logic and routes
│   ├── models/                # MongoDB models
│   └── server.js              # Express.js server configuration
├── .env                       # Environment variables (MongoDB URI, API keys, etc.)
├── .gitignore                 # Git ignore file
├── package.json               # Node.js dependencies and scripts
└── README.md                  # Project documentation
```

## Usage

### Real-Time Traffic Monitoring
- Click on the **"Real-Time Traffic"** button to open a dialog where users can enter a destination.
- The system fetches real-time traffic data for the selected route using the **OpenRouteService** API and displays the route on the map.
- If traffic congestion is detected, a **traffic alert** is shown, notifying the user.

### Suspicious Activity Detection
- Click on the **"Suspicious Activity Detection"** button to check for any suspicious activity in the monitored area.
- The system queries the **MongoDB database** for any flagged suspicious activities and displays the result after a short delay.

### Geolocation Tracking & Navigation
- The system uses the browser's **geolocation API** to get the user's current location and show it on the map.
- The user can select a destination and view directions with traffic data.

## Development
To run the application in development mode, follow these steps:
1. Set up the project as described in the **Installation** section.
2. Run the app in development mode:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000` in your browser to see the live version of the app.

### Running the Backend Locally
If you wish to run the backend API locally, use the following command:
```bash
npm run server
```

This will start the Express.js server and connect to the MongoDB instance.

## API Endpoints
- **GET /api/traffic-monitoring**: Fetch real-time traffic data for the given route.
- **GET /api/suspicious-activity**: Check for suspicious activity in the monitored area.

## MongoDB Schema
The MongoDB database stores records of suspicious activity that may include:
- **activity_id**: Unique identifier for the activity.
- **location**: Coordinates or area where the activity was detected.
- **activity_type**: Type of suspicious activity (e.g., accident, illegal activity).
- **timestamp**: Time when the activity was detected.
