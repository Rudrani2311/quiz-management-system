const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  questionText: { type: String, required: true, trim: true },
  options: {
    type: [String],
    required: true,
    validate: [(arr) => arr.length === 4, 'Four options are required']
  },
  correctAnswer: { type: String, required: true, trim: true },
  marks: { type: Number, required: true, default: 1 }
});

module.exports = mongoose.model('Question', questionSchema);
