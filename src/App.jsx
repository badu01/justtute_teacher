// App.js (Updated)
import ManageSessions from './pages/ManageSessions';
import Dashboard from './pages/Dashboard'; // Import Dashboard
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/sessions" element={
                    <ProtectedRoute>
                        <ManageSessions/>
                    </ProtectedRoute>
                } />
                
                {/* Catch all - using hash navigation */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;