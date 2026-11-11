const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');
const Result = require('./models/Result');

const seedInitialData = async () => {
  if ((await User.countDocuments()) > 0) return;

  await User.create({
    name: 'Dr. Vikram Sen',
    email: 'admin@university.edu',
    password: 'password123',
    role: 'admin'
  });

  const student1 = await User.create({
    name: 'Aarav Sharma',
    email: 'student@university.edu',
    password: 'password123',
    role: 'student'
  });

  const student2 = await User.create({
    name: 'Meera Nair',
    email: 'meera@university.edu',
    password: 'password123',
    role: 'student'
  });

  const quiz1 = await Quiz.create({
    title: 'React components, state and hooks',
    description: 'Assessment covering JSX, functional components, props, useState, useEffect and React Router.',
    duration: 10,
    totalMarks: 8
  });

  await Question.insertMany([
    {
      quiz: quiz1._id,
      questionText: 'Which hook is used to perform side effects such as fetching data in a React component?',
      options: ['useState', 'useEffect', 'useContext', 'useRef'],
      correctAnswer: 'useEffect',
      marks: 2
    },
    {
      quiz: quiz1._id,
      questionText: 'How are values passed from a parent component to a child component in React?',
      options: ['Using state', 'Using props', 'Using localStorage', 'Using DOM selectors'],
      correctAnswer: 'Using props',
      marks: 2
    },
    {
      quiz: quiz1._id,
      questionText: 'What happens when an empty dependency array [] is passed to useEffect?',
      options: ['Runs on every render', 'Runs once on initial mount', 'Never runs', 'Throws an error'],
      correctAnswer: 'Runs once on initial mount',
      marks: 2
    },
    {
      quiz: quiz1._id,
      questionText: 'Which hook from React Router is used for programmatic navigation?',
      options: ['useNavigate', 'useRoute', 'useRedirect', 'useHistoryList'],
      correctAnswer: 'useNavigate',
      marks: 2
    }
  ]);

  const quiz2 = await Quiz.create({
    title: 'Node.js, Express and MongoDB fundamentals',
    description: 'Evaluation on Express REST APIs, middleware, Mongoose schemas, JWT and bcrypt.',
    duration: 10,
    totalMarks: 8
  });

  const q2List = await Question.insertMany([
    {
      quiz: quiz2._id,
      questionText: 'Which Express middleware parses incoming requests with JSON payloads?',
      options: ['express.static()', 'express.json()', 'express.Router()', 'express.urlencoded()'],
      correctAnswer: 'express.json()',
      marks: 2
    },
    {
      quiz: quiz2._id,
      questionText: 'Which Mongoose method replaces ObjectId references with actual documents?',
      options: ['populate()', 'aggregate()', 'select()', 'lean()'],
      correctAnswer: 'populate()',
      marks: 2
    },
    {
      quiz: quiz2._id,
      questionText: 'How many arguments does an Express error-handling middleware function take?',
      options: ['Two', 'Three', 'Four', 'One'],
      correctAnswer: 'Four',
      marks: 2
    },
    {
      quiz: quiz2._id,
      questionText: 'Why should quiz answers be evaluated on the backend instead of the frontend?',
      options: [
        'Frontend requests can be inspected or modified by the user',
        'React cannot calculate totals',
        'MongoDB only works with HTML forms',
        'CSS prevents calculations'
      ],
      correctAnswer: 'Frontend requests can be inspected or modified by the user',
      marks: 2
    }
  ]);

  await Result.create({
    student: student1._id,
    quiz: quiz2._id,
    score: 6,
    totalMarks: 8,
    percentage: 75,
    correctCount: 3,
    incorrectCount: 1,
    attemptStatus: 'completed',
    answers: q2List.map((q, idx) => ({
      questionText: q.questionText,
      selectedAnswer: idx < 3 ? q.correctAnswer : q.options[0],
      correctAnswer: q.correctAnswer,
      isCorrect: idx < 3,
      marks: q.marks
    }))
  });

  await Result.create({
    student: student2._id,
    quiz: quiz2._id,
    score: 8,
    totalMarks: 8,
    percentage: 100,
    correctCount: 4,
    incorrectCount: 0,
    attemptStatus: 'completed',
    answers: q2List.map((q) => ({
      questionText: q.questionText,
      selectedAnswer: q.correctAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect: true,
      marks: q.marks
    }))
  });
};

module.exports = seedInitialData;
