import React from 'react';

const QuestionCard = ({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  isMarkedForReview,
  onSelectOption,
  onToggleReview,
  onPrev,
  onNext,
  onSubmit
}) => {
  if (!question) return null;

  return (
    <div className="panel-blue">
      <div className="panel-header">
        <strong>
          Question {questionIndex + 1} of {totalQuestions}
        </strong>
        <span className="tag tag-blue">Marks: {question.marks || 1}</span>
      </div>

      <p style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
        {question.questionText}
      </p>

      <div>
        {question.options.map((opt, idx) => (
          <label
            key={idx}
            className={`option-item ${selectedAnswer === opt ? 'selected' : ''}`}
            onClick={() => onSelectOption(question._id, opt)}
          >
            <input
              type="radio"
              name={`q-${question._id}`}
              checked={selectedAnswer === opt}
              onChange={() => onSelectOption(question._id, opt)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-outline-blue"
            disabled={questionIndex === 0}
            onClick={onPrev}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-outline-green"
            onClick={() => onToggleReview(question._id)}
          >
            {isMarkedForReview ? 'Unmark review' : 'Mark for review'}
          </button>
        </div>

        {questionIndex < totalQuestions - 1 ? (
          <button type="button" className="btn btn-primary" onClick={onNext}>
            Next
          </button>
        ) : (
          <button type="button" className="btn btn-green" onClick={onSubmit}>
            Submit examination
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
