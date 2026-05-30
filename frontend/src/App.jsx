import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HospitalBackground from './components/HospitalBackground';
import Dashboard from './pages/Dashboard';
import PatientsManagement from './pages/PatientsManagement';
import DoctorsManagement from './pages/DoctorsManagement';
import RoomAllocation from './pages/RoomAllocation';
import BillingSystem from './pages/BillingSystem';
import Pharmacy from './pages/Pharmacy';
import StaffManagement from './pages/StaffManagement';
import Appointments from './pages/Appointments';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-transparent selection:bg-primary/20 selection:text-primary relative">
        <HospitalBackground />
        <Sidebar />
        <main className="flex-1 overflow-y-auto z-10 relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<PatientsManagement />} />
            <Route path="/doctors" element={<DoctorsManagement />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/rooms" element={<RoomAllocation />} />
            <Route path="/billing" element={<BillingSystem />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/staff" element={<StaffManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
