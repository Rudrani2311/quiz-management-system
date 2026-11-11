import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { api } from '../api';

const CreateQuiz = () => {
  const [searchParams] = useSearchParams();
  const initialQuizId = searchParams.get('quizId') || '';

  const [quizzes, setQuizzes] = useState([]);
  const [editingQuizId, setEditingQuizId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(10);

  const [selectedQuizId, setSelectedQuizId] = useState(initialQuizId);
  const [questions, setQuestions] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [marks, setMarks] = useState(2);
  const [message, setMessage] = useState('');

  const loadQuizzes = async (targetQuizId) => {
    const list = await api.getQuizzes();
    setQuizzes(list);
    const activeId = targetQuizId || selectedQuizId || (list[0] ? list[0]._id : '');
    if (activeId) {
      setSelectedQuizId(activeId);
      setQuestions(await api.getQuestionsByQuiz(activeId));
    }
  };

  useEffect(() => {
    loadQuizzes(initialQuizId);
  }, []);

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, description, duration: Number(duration) };
      if (editingQuizId) {
        await api.updateQuiz(editingQuizId, payload);
        setMessage('Quiz updated.');
      } else {
        const created = await api.createQuiz(payload);
        setSelectedQuizId(created._id);
        setMessage('Quiz created.');
      }
      setEditingQuizId('');
      setTitle('');
      setDescription('');
      setDuration(10);
      loadQuizzes();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      const payload = { quiz: selectedQuizId, questionText, options, correctAnswer, marks: Number(marks) };
      if (editingQuestionId) {
        await api.updateQuestion(editingQuestionId, payload);
        setMessage('Question updated.');
      } else {
        await api.createQuestion(payload);
        setMessage('Question added to quiz.');
      }
      setEditingQuestionId('');
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
      loadQuizzes(selectedQuizId);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleEditQuestion = (q) => {
    setEditingQuestionId(q._id);
    setSelectedQuizId(q.quiz?._id || q.quiz);
    setQuestionText(q.questionText);
    setOptions(q.options);
    setCorrectAnswer(q.correctAnswer);
    setMarks(q.marks);
  };

  const handleDeleteQuestion = async (id) => {
    await api.deleteQuestion(id);
    setMessage('Question deleted.');
    loadQuizzes(selectedQuizId);
  };

  return (
    <div className="admin-shell">
      <Sidebar />
      <main className="admin-main">
        <h1>Manage quizzes and questions</h1>
        {message && <div className="notice notice-green">{message}</div>}

        <div className="panel-blue">
          <div className="panel-header">
            <h2>{editingQuizId ? 'Edit quiz' : 'Create new quiz'}</h2>
            {quizzes.length > 0 && (
              <select
                className="form-control"
                style={{ width: 'auto' }}
                value={editingQuizId}
                onChange={(e) => {
                  const found = quizzes.find((q) => q._id === e.target.value);
                  setEditingQuizId(found ? found._id : '');
                  setTitle(found ? found.title : '');
                  setDescription(found ? found.description : '');
                  setDuration(found ? found.duration : 10);
                }}
              >
                <option value="">-- Select quiz to edit --</option>
                {quizzes.map((q) => (
                  <option key={q._id} value={q._id}>{q.title}</option>
                ))}
              </select>
            )}
          </div>

          <form onSubmit={handleSaveQuiz}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quiz title</label>
                <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Duration (minutes)</label>
                <input type="number" min="1" className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingQuizId ? 'Update quiz' : 'Create quiz'}
            </button>
          </form>
        </div>

        <div className="panel-green">
          <div className="panel-header">
            <h2>{editingQuestionId ? 'Edit question' : 'Add and assign question'}</h2>
          </div>

          <form onSubmit={handleSaveQuestion}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Assign to quiz</label>
                <select
                  className="form-control"
                  value={selectedQuizId}
                  onChange={async (e) => {
                    setSelectedQuizId(e.target.value);
                    setQuestions(await api.getQuestionsByQuiz(e.target.value));
                  }}
                  required
                >
                  {quizzes.map((q) => (
                    <option key={q._id} value={q._id}>{q.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Marks</label>
                <input type="number" min="1" className="form-control" value={marks} onChange={(e) => setMarks(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Question text</label>
              <input type="text" className="form-control" value={questionText} onChange={(e) => setQuestionText(e.target.value)} required />
            </div>

            <div className="form-row">
              {[0, 1, 2, 3].map((i) => (
                <div className="form-group" key={i}>
                  <label className="form-label">Option {i + 1}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={options[i]}
                    onChange={(e) => {
                      const next = [...options];
                      next[i] = e.target.value;
                      setOptions(next);
                    }}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Correct answer</label>
              <select className="form-control" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} required>
                <option value="">Select correct option</option>
                {options.filter(Boolean).map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-green">
              {editingQuestionId ? 'Update question' : 'Add question'}
            </button>
          </form>

          <table className="data-table" style={{ marginTop: '1.25rem' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Correct answer</th>
                <th>Marks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, idx) => (
                <tr key={q._id}>
                  <td>{idx + 1}</td>
                  <td>{q.questionText}</td>
                  <td>{q.correctAnswer}</td>
                  <td>{q.marks}</td>
                  <td>
                    <button type="button" className="btn btn-outline-blue btn-small" onClick={() => handleEditQuestion(q)}>Edit</button>{' '}
                    <button type="button" className="btn btn-teal btn-small" onClick={() => handleDeleteQuestion(q._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default CreateQuiz;
