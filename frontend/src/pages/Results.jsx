import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';

const Results = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const resultId = searchParams.get('resultId');

  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const loadResults = async () => {
      const list =
        user.role === 'admin'
          ? await api.getAllResults()
          : await api.getStudentResults(user._id);
      setResults(list);
      const match = list.find((r) => r._id === resultId) || list[0] || null;
      setSelected(match);
    };
    if (user) loadResults();
  }, [user, resultId]);

  const totalObtained = results.reduce((acc, r) => acc + (r.score || 0), 0);
  const totalPossible = results.reduce((acc, r) => acc + (r.totalMarks || 0), 0);
  const overallPercentage =
    totalPossible > 0 ? ((totalObtained / totalPossible) * 100).toFixed(1) : 0;
  const totalCorrect = results.reduce((acc, r) => acc + (r.correctCount || 0), 0);
  const totalIncorrect = results.reduce((acc, r) => acc + (r.incorrectCount || 0), 0);

  return (
    <main className="student-main">
      <h1>Results and performance analysis</h1>

      <div className="stats-grid">
        <div className="stat-box green-accent">
          <div className="stat-label">Total marks obtained</div>
          <div className="stat-value">
            {totalObtained} / {totalPossible}
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Percentage score</div>
          <div className="stat-value">{overallPercentage}%</div>
        </div>
        <div className="stat-box green-accent">
          <div className="stat-label">Correct answers</div>
          <div className="stat-value">{totalCorrect}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Incorrect answers</div>
          <div className="stat-value">{totalIncorrect}</div>
        </div>
      </div>

      {selected && (
        <div className="panel-green">
          <div className="panel-header">
            <h2>
              Evaluated answers: {selected.quiz?.title} ({selected.score}/{selected.totalMarks} —{' '}
              {selected.percentage}%)
            </h2>
          </div>

          {(selected.answers || []).map((ans, idx) => (
            <div
              key={idx}
              className={`notice ${ans.isCorrect ? 'notice-green' : ''}`}
              style={{ marginBottom: '0.65rem' }}
            >
              <div>
                <strong>
                  {idx + 1}. {ans.questionText}
                </strong>{' '}
                ({ans.isCorrect ? `+${ans.marks}` : '0'} marks)
              </div>
              <div>
                Selected answer: {ans.selectedAnswer || 'Unanswered'} | Correct answer:{' '}
                <strong>{ans.correctAnswer}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="panel-blue">
        <div className="panel-header">
          <h2>Quiz-wise performance and previous examination history</h2>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              {user.role === 'admin' && <th>Student</th>}
              <th>Quiz title</th>
              <th>Marks</th>
              <th>Percentage</th>
              <th>Correct</th>
              <th>Incorrect</th>
              <th>Date</th>
              <th>Sheet</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r._id}>
                {user.role === 'admin' && <td>{r.student?.name}</td>}
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
                    onClick={() => {
                      setSelected(r);
                      setSearchParams({ resultId: r._id });
                    }}
                  >
                    Inspect
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

export default Results;
