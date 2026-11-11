const express = require('express');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { protect, adminOnly, validateFields } = require('../middleware/auth');

const router = express.Router();

router.post('/submit', protect, validateFields(['quizId']), async (req, res, next) => {
  try {
    const { quizId, answers = {}, attemptStatus = 'completed' } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz || !quiz.isAvailable) {
      return res.status(400).json({ message: 'Quiz is unavailable.' });
    }

    const existing = await Result.findOne({ student: req.user._id, quiz: quizId });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted this examination.' });
    }

    const questions = await Question.find({ quiz: quizId });
    if (questions.length === 0) {
      return res.status(400).json({ message: 'No questions found for this quiz.' });
    }

    let score = 0;
    let totalMarks = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    const evaluatedAnswers = questions.map((q) => {
      const qMarks = Number(q.marks) || 1;
      totalMarks += qMarks;
      const selected = answers[q._id.toString()] || '';
      const isCorrect = selected === q.correctAnswer;

      if (isCorrect) {
        score += qMarks;
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }

      return {
        questionText: q.questionText,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        marks: qMarks
      };
    });

    const percentage = totalMarks > 0 ? Number(((score / totalMarks) * 100).toFixed(2)) : 0;

    const result = await Result.create({
      student: req.user._id,
      quiz: quizId,
      score,
      totalMarks,
      percentage,
      correctCount,
      incorrectCount,
      attemptStatus: attemptStatus === 'auto-submitted' ? 'auto-submitted' : 'completed',
      answers: evaluatedAnswers
    });

    const populated = await Result.findById(result._id)
      .populate('student', 'name email')
      .populate('quiz', 'title duration totalMarks');

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
});

router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const results = await Result.find()
      .populate('student', 'name email')
      .populate('quiz', 'title duration totalMarks')
      .sort({ submittedAt: -1 });
    res.json(results);
  } catch (err) {
    next(err);
  }
});

router.get('/:studentId', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.studentId) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const results = await Result.find({ student: req.params.studentId })
      .populate('student', 'name email')
      .populate('quiz', 'title duration totalMarks')
      .sort({ submittedAt: -1 });

    res.json(results);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
