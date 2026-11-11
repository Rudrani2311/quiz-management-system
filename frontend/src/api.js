const API_BASE = '/api';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('qmes_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const request = async (endpoint, options = {}) => {
  const user = getStoredUser();
  const headers = { 'Content-Type': 'application/json' };
  if (user && user.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }
  return data;
};

export const api = {
  getStoredUser,
  saveUser: (user) => localStorage.setItem('qmes_user', JSON.stringify(user)),
  clearUser: () => localStorage.removeItem('qmes_user'),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  getStats: () => request('/auth/stats'),
  getQuizzes: () => request('/quizzes'),
  createQuiz: (body) => request('/quizzes', { method: 'POST', body: JSON.stringify(body) }),
  updateQuiz: (id, body) => request(`/quizzes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteQuiz: (id) => request(`/quizzes/${id}`, { method: 'DELETE' }),
  getQuestionsByQuiz: (quizId) => request(`/questions/${quizId}`),
  createQuestion: (body) => request('/questions', { method: 'POST', body: JSON.stringify(body) }),
  updateQuestion: (id, body) => request(`/questions/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteQuestion: (id) => request(`/questions/${id}`, { method: 'DELETE' }),
  submitExamination: (body) => request('/results/submit', { method: 'POST', body: JSON.stringify(body) }),
  getAllResults: () => request('/results'),
  getStudentResults: (studentId) => request(`/results/${studentId}`)
};
