import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import CallbackPage from './components/CallbackPage';
import Dashboard from './components/Dashboard';
import DebugPage from './components/DebugPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route 
              path="/" 
              element={<LoginPage />} 
            />
            <Route 
              path="/debug" 
              element={<DebugPage />} 
            />
            <Route 
              path="/callback" 
              element={<CallbackPage />} 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
