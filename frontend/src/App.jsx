import React, { useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CreateQuiz from './pages/CreateQuiz';
import AttemptQuiz from './pages/AttemptQuiz';
import Results from './pages/Results';
import { api } from './api';

const App = () => {
  const [user, setUser] = useState(() => api.getStoredUser());

  const handleLogout = () => {
    api.clearUser();
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/student') : '/login'} replace />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login onLoginSuccess={setUser} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register onLoginSuccess={setUser} />}
        />
        <Route
          path="/admin"
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin/create-quiz"
          element={user?.role === 'admin' ? <CreateQuiz /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/student"
          element={user?.role === 'student' ? <StudentDashboard user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/quiz/:quizId"
          element={user?.role === 'student' ? <AttemptQuiz /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/results"
          element={user ? <Results user={user} /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
