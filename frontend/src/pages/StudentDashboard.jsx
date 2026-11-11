import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizCard from '../components/QuizCard';
import { api } from '../api';

const StudentDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [qList, rList] = await Promise.all([
        api.getQuizzes(),
        api.getStudentResults(user._id)
      ]);
      setQuizzes(qList);
      setResults(rList);
    };
    if (user?._id) loadData();
  }, [user]);

  return (
    <main className="student-main">
      <div className="panel-green">
        <div className="panel-header">
          <h1>Student dashboard</h1>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/results')}>
            View performance analysis
          </button>
        </div>
        <p style={{ marginBottom: 0 }}>
          Welcome, {user.name}. Select an available examination below or review your previous attempts.
        </p>
      </div>

      <div className="panel-blue">
        <div className="panel-header">
          <h2>Available quizzes ({quizzes.length})</h2>
        </div>

        <div className="quiz-cards-grid">
          {quizzes.map((q) => (
            <QuizCard
              key={q._id}
              quiz={q}
              role="student"
              onStartQuiz={(id) => navigate(`/quiz/${id}`)}
              onViewResult={(resId) => navigate(`/results?resultId=${resId}`)}
            />
          ))}
        </div>
      </div>

      <div className="panel-green">
        <div className="panel-header">
          <h2>Previous attempts ({results.length})</h2>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Quiz title</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Correct</th>
              <th>Incorrect</th>
              <th>Submitted on</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r._id}>
                <td>{r.quiz?.title}</td>
                <td>
                  {r.score} / {r.totalMarks}
                </td>
                <td>
                  <span className="tag tag-green">{r.percentage}%</span>
                </td>
                <td>{r.correctCount}</td>
                <td>{r.incorrectCount}</td>
                <td>{new Date(r.submittedAt).toLocaleDateString()}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-blue btn-small"
                    onClick={() => navigate(`/results?resultId=${r._id}`)}
                  >
                    Check result
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default StudentDashboard;
