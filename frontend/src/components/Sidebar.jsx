import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="admin-sidebar">
      <button
        type="button"
        className={`sidebar-btn ${location.pathname === '/admin' ? 'active' : ''}`}
        onClick={() => navigate('/admin')}
      >
        Admin overview
      </button>

      <button
        type="button"
        className={`sidebar-btn ${location.pathname === '/admin/create-quiz' ? 'active' : ''}`}
        onClick={() => navigate('/admin/create-quiz')}
      >
        Manage quizzes and questions
      </button>

      <button
        type="button"
        className={`sidebar-btn ${location.pathname === '/results' ? 'active' : ''}`}
        onClick={() => navigate('/results')}
      >
        Student examination results
      </button>
    </aside>
  );
};

export default Sidebar;
