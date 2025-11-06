import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import Layout from './components/Layout/layout';
import { AuthProvider } from './/context/AuthContext';
import Collaborators from './pages/Collaborators';
import ProtectedRoute from './ProtectedRoute';
import Category from './pages/Category';
import Notifications from './pages/Notifications';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="*" element={<Layout />}>
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="collaborators" element={<ProtectedRoute><Collaborators /></ProtectedRoute>} />
            <Route path="category" element={<ProtectedRoute><Category /></ProtectedRoute>} />
            <Route path="notifications" element={<ProtectedRoute><Notifications/></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
