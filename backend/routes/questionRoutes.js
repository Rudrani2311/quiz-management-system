const express = require('express');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const { protect, adminOnly, validateFields } = require('../middleware/auth');

const router = express.Router();

const syncQuizMarks = async (quizId) => {
  if (!quizId) return;
  const list = await Question.find({ quiz: quizId });
  const totalMarks = list.reduce((sum, q) => sum + (Number(q.marks) || 1), 0);
  await Quiz.findByIdAndUpdate(quizId, { totalMarks });
};

router.get('/:quizId', protect, async (req, res, next) => {
  try {
    const query = Question.find({ quiz: req.params.quizId }).populate('quiz', 'title description duration totalMarks');
    if (req.user.role !== 'admin') {
      query.select('-correctAnswer');
    }
    const questions = await query;
    res.json(questions);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  protect,
  adminOnly,
  validateFields(['quiz', 'questionText', 'options', 'correctAnswer']),
  async (req, res, next) => {
    try {
      const { quiz, questionText, options, correctAnswer, marks } = req.body;
      if (!Array.isArray(options) || options.length !== 4) {
        return res.status(400).json({ message: 'Four options are required.' });
      }
      if (!options.includes(correctAnswer)) {
        return res.status(400).json({ message: 'Correct answer must match one of the options.' });
      }

      const question = await Question.create({
        quiz,
        questionText: questionText.trim(),
        options: options.map((o) => String(o).trim()),
        correctAnswer: String(correctAnswer).trim(),
        marks: Number(marks) || 1
      });

      await syncQuizMarks(quiz);
      res.status(201).json(question);
    } catch (err) {
      next(err);
    }
  }
);

router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const existing = await Question.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Question not found.' });

    const oldQuizId = existing.quiz.toString();
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    await syncQuizMarks(oldQuizId);
    if (updated.quiz.toString() !== oldQuizId) {
      await syncQuizMarks(updated.quiz);
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found.' });

    const quizId = question.quiz;
    await question.deleteOne();
    await syncQuizMarks(quizId);
    res.json({ message: 'Question deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
