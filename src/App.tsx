
import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChildrenRecords from './pages/ChildrenRecords';
import FoodInventory from './pages/FoodInventory';
import ClothingInventory from './pages/ClothingInventory';
import Donations from './pages/Donations';
import Backup from './pages/Backup';
import Speech from './pages/Speech';
import VoiceTranslation from './pages/VoiceTranslation';
import HealthRecords from './pages/HealthRecords';
import Reports from './pages/Reports';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </LanguageProvider>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Dashboard />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Dashboard />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/children-records"
          element={
            isAuthenticated ? (
              <AppLayout>
                <ChildrenRecords />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/food-inventory"
          element={
            isAuthenticated ? (
              <AppLayout>
                <FoodInventory />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/clothing-inventory"
          element={
            isAuthenticated ? (
              <AppLayout>
                <ClothingInventory />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/donations"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Donations />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/backup"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Backup />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/speech"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Speech />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/voice-translation"
          element={
            isAuthenticated ? (
              <AppLayout>
                <VoiceTranslation />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/health-records"
          element={
            isAuthenticated ? (
              <AppLayout>
                <HealthRecords />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/reports"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Reports />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
