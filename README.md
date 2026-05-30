# Hospital Management System (HMS)

A full-stack, production-level Hospital Management System built with React, Node.js, Express, and MySQL.

## Prerequisites
- Node.js (v18 or higher recommended)
- MySQL Server

## Step 1: Database Setup
1. Ensure your MySQL server is running.
2. The default configuration uses `root` as the username and an empty password. If your MySQL setup is different, please update `backend/.env`.
3. Import the database schema:
   ```bash
   mysql -u root -p < database.sql
   ```
   *This creates the `hms_db` database and seeds it with an Admin user, some Rooms, and Medicines.*

## Step 2: Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Start the server (it runs on port 3000):
   ```bash
   node server.js
   ```

## Step 3: Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the Vite React development server:
   ```bash
   npm run dev
   ```
3. Open your browser to the URL shown by Vite (usually `http://localhost:5173`).

## Key Features
- **Modern Premium UI**: Built with Tailwind CSS featuring high-performance glassmorphism, responsive components, and custom premium styles.
  - **Animated Hospital-Themed Wallpaper**: Includes glowing organic mesh gradients (Emerald, Cyan, Lavender), floating interactive clinical icons (Medical Crosses, DNA strands, stethoscopes, capsule pills), and smooth, realistic moving ECG (electrocardiogram) waves that replicate real patient monitor systems.
- **Relational Schema Integrity**: Fully normalized MySQL database enforcing strict foreign keys.
- **Modules**:
  - Staff / Admin (Bonus Analytics included on Dashboard)
  - Patients & Doctors CRUD
  - Room Allocation & Admissions
  - Pharmacy & Out-Patient Prescriptions
  - Automated Billing Calculations based on room costs and admission duration.
