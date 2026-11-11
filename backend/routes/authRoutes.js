const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Result = require('../models/Result');
const { protect, adminOnly, validateFields, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id, role) => jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });

router.post('/register', validateFields(['name', 'email', 'password']), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role === 'admin' ? 'admin' : 'student'
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', validateFields(['email', 'password']), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (err) {
    next(err);
  }
});

router.get('/stats', protect, adminOnly, async (req, res, next) => {
  try {
    const [totalStudents, totalQuizzes, totalQuestions, totalResults] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Quiz.countDocuments(),
      Question.countDocuments(),
      Result.countDocuments()
    ]);

    res.json({ totalStudents, totalQuizzes, totalQuestions, totalResults });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
