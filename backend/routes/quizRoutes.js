const express = require('express');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Result = require('../models/Result');
const { protect, adminOnly, validateFields } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { isAvailable: true };
    const quizzes = await Quiz.find(filter).sort({ createdAt: -1 }).lean();
    const questions = await Question.find().select('quiz marks').lean();

    let attemptsByQuiz = {};
    if (req.user.role === 'student') {
      const results = await Result.find({ student: req.user._id }).lean();
      results.forEach((r) => {
        attemptsByQuiz[r.quiz.toString()] = r;
      });
    }

    const enriched = quizzes.map((q) => {
      const qList = questions.filter((item) => item.quiz.toString() === q._id.toString());
      const sumMarks = qList.reduce((acc, item) => acc + (item.marks || 1), 0);
      return {
        ...q,
        questionCount: qList.length,
        totalMarks: sumMarks > 0 ? sumMarks : q.totalMarks,
        attemptedResult: attemptsByQuiz[q._id.toString()] || null
      };
    });

    res.json(enriched);
  } catch (err) {
    next(err);
  }
});

router.post('/', protect, adminOnly, validateFields(['title', 'description', 'duration']), async (req, res, next) => {
  try {
    const { title, description, duration, totalMarks, isAvailable } = req.body;
    const quiz = await Quiz.create({
      title: title.trim(),
      description: description.trim(),
      duration: Number(duration),
      totalMarks: Number(totalMarks) || 0,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true
    });
    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });
    res.json(quiz);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });

    await Promise.all([
      Question.deleteMany({ quiz: quiz._id }),
      Result.deleteMany({ quiz: quiz._id }),
      quiz.deleteOne()
    ]);

    res.json({ message: 'Quiz deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
