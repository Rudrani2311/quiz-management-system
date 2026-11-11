import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import QuizCard from '../components/QuizCard';
import { api } from '../api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalStudents: 0, totalQuizzes: 0, totalQuestions: 0 });
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const [sData, qData, rData] = await Promise.all([
        api.getStats(),
        api.getQuizzes(),
        api.getAllResults()
      ]);
      setStats(sData);
      setQuizzes(qData);
      setResults(rData);
    } catch (err) {
      setMessage(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteQuiz = async (id) => {
    try {
      await api.deleteQuiz(id);
      setMessage('Quiz deleted.');
      loadData();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="admin-shell">
      <Sidebar />

      <main className="admin-main">
        <div className="panel-header">
          <h1>Admin dashboard</h1>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/admin/create-quiz')}
          >
            Create quiz or manage questions
          </button>
        </div>

        {message && <div className="notice notice-green">{message}</div>}

        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-label">Total registered students</div>
            <div className="stat-value">{stats.totalStudents}</div>
          </div>
          <div className="stat-box green-accent">
            <div className="stat-label">Total quizzes created</div>
            <div className="stat-value">{stats.totalQuizzes}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Total questions</div>
            <div className="stat-value">{stats.totalQuestions}</div>
          </div>
        </div>

        <div className="panel-blue">
          <div className="panel-header">
            <h2>Quizzes ({quizzes.length})</h2>
          </div>

          <div className="quiz-cards-grid">
            {quizzes.map((q) => (
              <QuizCard
                key={q._id}
                quiz={q}
                role="admin"
                onManage={(quiz) => navigate(`/admin/create-quiz?quizId=${quiz._id}`)}
                onDelete={handleDeleteQuiz}
              />
            ))}
          </div>
        </div>

        <div className="panel-green">
          <div className="panel-header">
            <h2>Student examination results ({results.length})</h2>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Quiz</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r._id}>
                  <td>{r.student?.name}</td>
                  <td>{r.student?.email}</td>
                  <td>{r.quiz?.title}</td>
                  <td>
                    {r.score} / {r.totalMarks}
                  </td>
                  <td>
                    <span className="tag tag-green">{r.percentage}%</span>
                  </td>
                  <td>{r.attemptStatus}</td>
                  <td>{new Date(r.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
