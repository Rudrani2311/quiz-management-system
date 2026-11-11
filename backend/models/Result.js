const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true, default: 0 },
  totalMarks: { type: Number, required: true, default: 0 },
  percentage: { type: Number, required: true, default: 0 },
  correctCount: { type: Number, default: 0 },
  incorrectCount: { type: Number, default: 0 },
  attemptStatus: { type: String, enum: ['completed', 'auto-submitted'], default: 'completed' },
  answers: [
    {
      questionText: String,
      selectedAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean,
      marks: Number
    }
  ],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
