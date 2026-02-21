# Vitalize BMI - 3D Health Dashboard

A premium, glassmorphism-styled 3D BMI calculator with real-time health insights, historical tracking, and animated data visualization.

## Features

- **3D Interactive UI**: Smooth animations and tilting effects using Framer Motion.
- **Real-time Calculation**: Instant BMI calculation with health category assessment.
- **Historical Tracking**: Stores recent records with local storage fallback.
- **Mock Backend**: Express server with in-memory storage for easy setup.
- **Dark Mode Support**: Seamless transition between dark and light themes.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Express, Node.js, tsx.

## Run Locally

**Prerequisites:** Node.js (v18 or higher)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the app:**
   ```bash
   npm run dev
   ```
   This will start both the Express server and Vite development middleware on [http://localhost:3000](http://localhost:3000).

## Project Structure

- `App.tsx`: Main application component.
- `server.js`: Express server with Vite middleware integration and API routes.
- `components/`: Reusable UI components.
- `db.sql`: Database schema definition (for reference).
- `src/index.css`: Tailwind CSS entry point and custom styles.

![Screenshot of the project](https://github.com/Owais-amin-07/-Vitalize-BMI-Health-Dashboard/blob/bca9e9745fb30f266180bb37139588e388ec05d4/web%20proj%2001.png)

