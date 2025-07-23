import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPuzzles from './pages/AdminPuzzles';
import GamePlay from './pages/GamePlay';
import Leaderboard from './pages/Leaderboard';
import 'antd/dist/reset.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      Loading...
    </div>;
  }

  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      Loading...
    </div>;
  }

  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

const CaptainRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      Loading...
    </div>;
  }

  return user && user.role === 'captain' ? children : <Navigate to="/dashboard" />;
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/puzzles"
              element={
                <AdminRoute>
                  <AdminPuzzles />
                </AdminRoute>
              }
            />
            <Route
              path="/game"
              element={
                <CaptainRoute>
                  <GamePlay />
                </CaptainRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <PrivateRoute>
                  <Leaderboard />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
