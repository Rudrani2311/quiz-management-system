import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import { api } from '../api';

const AttemptQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [reviewIds, setReviewIds] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const submittedRef = useRef(false);
  const answersRef = useRef({});

  useEffect(() => {
    answersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  useEffect(() => {
    const loadQuestions = async () => {
      const list = await api.getQuestionsByQuiz(quizId);
      setQuestions(list);
      const durationMins = list[0]?.quiz?.duration || 10;
      setSecondsLeft(durationMins * 60);
    };
    loadQuestions();
  }, [quizId]);

  const submitExam = async (status = 'completed') => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    try {
      const res = await api.submitExamination({
        quizId,
        answers: answersRef.current,
        attemptStatus: status
      });
      navigate(`/results?resultId=${res._id}`);
    } catch {
      navigate('/results');
    }
  };

  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) {
      submitExam('auto-submitted');
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = (secs) => {
    const m = Math.floor((secs || 0) / 60);
    const s = (secs || 0) % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSelectOption = (qId, opt) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const handleToggleReview = (qId) => {
    setReviewIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const currentQuestion = questions[currentIndex];
  const quizTitle = currentQuestion?.quiz?.title || 'Timed examination';

  return (
    <div className="exam-container">
      <div className="exam-top-bar">
        <div>
          <h2 style={{ marginBottom: 0 }}>{quizTitle}</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="timer-box">Time remaining: {formatTime(secondsLeft)}</div>
          <button
            type="button"
            className="btn btn-green"
            onClick={() => submitExam('completed')}
          >
            Submit examination
          </button>
        </div>
      </div>

      <div className="exam-grid">
        <QuestionCard
          question={currentQuestion}
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          selectedAnswer={currentQuestion ? selectedAnswers[currentQuestion._id] : ''}
          isMarkedForReview={currentQuestion ? reviewIds.includes(currentQuestion._id) : false}
          onSelectOption={handleSelectOption}
          onToggleReview={handleToggleReview}
          onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          onNext={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
          onSubmit={() => submitExam('completed')}
        />

        <aside className="panel-green">
          <h3>Question navigation</h3>
          <div className="question-palette">
            {questions.map((q, idx) => {
              const isAnswered = Boolean(selectedAnswers[q._id]);
              const isReview = reviewIds.includes(q._id);
              let cls = 'palette-btn';
              if (isReview) cls += ' review';
              else if (isAnswered) cls += ' answered';
              if (idx === currentIndex) cls += ' current';

              return (
                <button
                  key={q._id}
                  type="button"
                  className={cls}
                  onClick={() => setCurrentIndex(idx)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <p style={{ fontSize: '0.9rem', marginBottom: '0.35rem' }}>
            Answered: {Object.keys(selectedAnswers).length} / {questions.length}
          </p>
          <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>
            Marked for review: {reviewIds.length}
          </p>
        </aside>
      </div>
    </div>
  );
};

export default AttemptQuiz;
