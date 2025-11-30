import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import './App.css'
import DashboardPage from './pages/DashboardPage'
import MachinesPage from './pages/MachinesPage'
import MachineDetailsPage from './pages/MachineDetailsPage'
import MachineFormPage from './pages/MachineFormPage'
import TechniciansPage from './pages/TechniciansPage'
import TechnicianDetailsPage from './pages/TechnicianDetailsPage'
import TechnicianFormPage from './pages/TechnicianFormPage'
import MaintenancesPage from './pages/MaintenancesPage'
import MaintenanceDetailsPage from './pages/MaintenanceDetailsPage'
import MaintenanceFormPage from './pages/MaintenanceFormPage'
import SparePartsPage from './pages/SparePartsPage'
import SparePartDetailsPage from './pages/SparePartDetailsPage'
import SparePartFormPage from './pages/SparePartFormPage'
import TicketsPage from './pages/TicketsPage'
import TicketDetailsPage from './pages/TicketDetailsPage'
import TicketFormPage from './pages/TicketFormPage'
import TemplatesPage from './pages/TemplatesPage'
import CalendarPage from './pages/CalendarPage'
import ReportsPage from './pages/ReportsPage'
import LoginPage from './pages/LoginPage'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/*" element={
        <PrivateRoute>
          <Box sx={{ display: 'flex' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px' }}>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/machines" element={<MachinesPage />} />
                <Route path="/machines/new" element={<MachineFormPage />} />
                <Route path="/machines/:id" element={<MachineDetailsPage />} />
                <Route path="/machines/:id/edit" element={<MachineFormPage />} />
                <Route path="/technicians" element={<TechniciansPage />} />
                <Route path="/technicians/new" element={<TechnicianFormPage />} />
                <Route path="/technicians/:id" element={<TechnicianDetailsPage />} />
                <Route path="/technicians/:id/edit" element={<TechnicianFormPage />} />
                <Route path="/maintenances" element={<MaintenancesPage />} />
                <Route path="/maintenances/new" element={<MaintenanceFormPage />} />
                <Route path="/maintenances/:id" element={<MaintenanceDetailsPage />} />
                <Route path="/maintenances/:id/edit" element={<MaintenanceFormPage />} />
                <Route path="/spare-parts" element={<SparePartsPage />} />
                <Route path="/spare-parts/new" element={<SparePartFormPage />} />
                <Route path="/spare-parts/:id" element={<SparePartDetailsPage />} />
                <Route path="/spare-parts/:id/edit" element={<SparePartFormPage />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/tickets/new" element={<TicketFormPage />} />
                <Route path="/tickets/:id" element={<TicketDetailsPage />} />
                <Route path="/tickets/:id/edit" element={<TicketFormPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Routes>
            </Box>
          </Box>
        </PrivateRoute>
      } />
    </Routes>
  )
}

export default App
