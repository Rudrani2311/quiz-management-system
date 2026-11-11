import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className={`top-navbar ${user?.role === 'student' ? 'student-navbar' : ''}`}>
      <Link to={user ? (user.role === 'admin' ? '/admin' : '/student') : '/login'} className="navbar-title">
        Quiz management and examination system
      </Link>

      <div className="navbar-links">
        {user ? (
          <>
            {user.role === 'admin' ? (
              <>
                <Link to="/admin" className={`navbar-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                  Admin dashboard
                </Link>
                <Link
                  to="/admin/create-quiz"
                  className={`navbar-link ${location.pathname === '/admin/create-quiz' ? 'active' : ''}`}
                >
                  Manage quizzes and questions
                </Link>
              </>
            ) : (
              <Link to="/student" className={`navbar-link ${location.pathname === '/student' ? 'active' : ''}`}>
                Student dashboard
              </Link>
            )}
            <Link to="/results" className={`navbar-link ${location.pathname === '/results' ? 'active' : ''}`}>
              Results
            </Link>
            <span style={{ fontSize: '0.92rem' }}>
              {user.name} ({user.role})
            </span>
            <button type="button" className="btn btn-outline-green btn-small" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Log in</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
