import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import DashboardPage from './pages/DashboardPage'
import MachinesPage from './pages/MachinesPage'
import MachineDetailsPage from './pages/MachineDetailsPage'
import MachineFormPage from './pages/MachineFormPage'
import TechniciansPage from './pages/TechniciansPage'
import TechnicianDetailsPage from './pages/TechnicianDetailsPage'
import TechnicianFormPage from './pages/TechnicianFormPage'
import MaintenancesPage from './pages/MaintenancesPage'
import SparePartsPage from './pages/SparePartsPage'
import TicketsPage from './pages/TicketsPage'
import TemplatesPage from './pages/TemplatesPage'
import CalendarPage from './pages/CalendarPage'
import ReportsPage from './pages/ReportsPage'
import LoginPage from './pages/LoginPage'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      } />
      <Route path="/machines" element={
        <PrivateRoute>
          <MachinesPage />
        </PrivateRoute>
      } />
      <Route path="/machines/new" element={
        <PrivateRoute>
          <MachineFormPage />
        </PrivateRoute>
      } />
      <Route path="/machines/:id" element={
        <PrivateRoute>
          <MachineDetailsPage />
        </PrivateRoute>
      } />
      <Route path="/machines/:id/edit" element={
        <PrivateRoute>
          <MachineFormPage />
        </PrivateRoute>
      } />
      <Route path="/technicians" element={
        <PrivateRoute>
          <TechniciansPage />
        </PrivateRoute>
      } />
      <Route path="/technicians/new" element={
        <PrivateRoute>
          <TechnicianFormPage />
        </PrivateRoute>
      } />
      <Route path="/technicians/:id" element={
        <PrivateRoute>
          <TechnicianDetailsPage />
        </PrivateRoute>
      } />
      <Route path="/technicians/:id/edit" element={
        <PrivateRoute>
          <TechnicianFormPage />
        </PrivateRoute>
      } />
      <Route path="/maintenances" element={
        <PrivateRoute>
          <MaintenancesPage />
        </PrivateRoute>
      } />
      <Route path="/spare-parts" element={
        <PrivateRoute>
          <SparePartsPage />
        </PrivateRoute>
      } />
      <Route path="/tickets" element={
        <PrivateRoute>
          <TicketsPage />
        </PrivateRoute>
      } />
      <Route path="/templates" element={
        <PrivateRoute>
          <TemplatesPage />
        </PrivateRoute>
      } />
      <Route path="/calendar" element={
        <PrivateRoute>
          <CalendarPage />
        </PrivateRoute>
      } />
      <Route path="/reports" element={
        <PrivateRoute>
          <ReportsPage />
        </PrivateRoute>
      } />
      {/* Agregar más rutas según sea necesario */}
    </Routes>
  )
}

export default App
