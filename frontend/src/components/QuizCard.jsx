import React from 'react';

const QuizCard = ({ quiz, role = 'student', onStartQuiz, onViewResult, onManage, onDelete }) => {
  const attempted = quiz.attemptedResult;

  return (
    <div className="quiz-card">
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ fontSize: '1.15rem' }}>{quiz.title}</h3>
          <span className={`tag ${attempted ? 'tag-green' : 'tag-blue'}`}>
            {role === 'admin'
              ? `${quiz.questionCount || 0} questions`
              : attempted
              ? `Scored ${attempted.percentage}%`
              : 'Available'}
          </span>
        </div>

        <p style={{ color: 'var(--text-sub)', fontSize: '0.94rem' }}>{quiz.description}</p>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>
          Duration: {quiz.duration} mins | Total marks: {quiz.totalMarks} | Instructions: One question at a time, automatic submission on timer expiry.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        {role === 'student' ? (
          attempted ? (
            <button type="button" className="btn btn-outline-green" onClick={() => onViewResult(attempted._id)}>
              View result ({attempted.score}/{attempted.totalMarks})
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-green"
              disabled={!quiz.questionCount}
              onClick={() => onStartQuiz(quiz._id)}
            >
              Start examination
            </button>
          )
        ) : (
          <>
            <button type="button" className="btn btn-primary btn-small" onClick={() => onManage(quiz)}>
              Edit / questions
            </button>
            <button type="button" className="btn btn-teal btn-small" onClick={() => onDelete(quiz._id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
