import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function PracticeQuestions() {
  const navigate = useNavigate();

  const questions = JSON.parse(
    localStorage.getItem("practiceQuestions") || "[]"
  );

  const settings = JSON.parse(
    localStorage.getItem("practiceSettings") || "{}"
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState({});

  const [markedQuestions, setMarkedQuestions] = useState([]);

  const [timeLeft, setTimeLeft] = useState(
    questions.length * 60
  );

  const [submitting, setSubmitting] = useState(false);

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [error, setError] = useState("");

  /*
   * If no questions exist
   */
  if (questions.length === 0) {
    return (
      <>
        <Navbar />

        <div className="practice-test-page">
          <div className="practice-empty">
            <h2>No practice questions found.</h2>

            <p>
              Please start a new practice session.
            </p>

            <button
              className="primary-button"
              onClick={() => navigate("/practice")}
            >
              Go to Practice
            </button>
          </div>
        </div>
      </>
    );
  }

  const currentQuestion = questions[currentIndex];

  /*
   * Timer
   */
  useEffect(() => {
    if (submitting) {
      return;
    }

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitting]);

  /*
   * Format timer
   */
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  /*
   * Select answer
   */
  const handleAnswer = (answer) => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion._id]: answer,
    }));
  };

  /*
   * Clear answer
   */
  const handleClearAnswer = () => {
    setAnswers((previous) => {
      const updated = { ...previous };

      delete updated[currentQuestion._id];

      return updated;
    });
  };

  /*
   * Next question
   */
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    }
  };

  /*
   * Previous question
   */
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1);
    }
  };

  /*
   * Go directly to question
   */
  const handleQuestionNavigation = (index) => {
    setCurrentIndex(index);
  };

  /*
   * Mark / unmark question
   */
  const handleMarkForReview = () => {
    setMarkedQuestions((previous) => {
      if (previous.includes(currentQuestion._id)) {
        return previous.filter(
          (id) => id !== currentQuestion._id
        );
      }

      return [...previous, currentQuestion._id];
    });
  };

  /*
   * Submit practice
   */
  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError("");
    setShowSubmitModal(false);

    try {
      const formattedAnswers = questions.map(
        (question) => ({
          questionId: question._id,
          selectedAnswer:
            answers[question._id] || "",
        })
      );

      const response = await api.post(
        "/practice/submit",
        {
          category: settings.category,
          difficulty: settings.difficulty,
          answers: formattedAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      console.log(
        "Practice result:",
        response.data
      );

      localStorage.setItem(
        "practiceResult",
        JSON.stringify(response.data.result)
      );

      localStorage.setItem(
        "attemptId",
        response.data.attemptId
      );

      navigate("/result");
    } catch (error) {
      console.error(
        "Submit practice error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to submit practice."
      );

      setSubmitting(false);
    }
  };

  /*
   * Count answered questions
   */
  const answeredCount = questions.filter(
    (question) =>
      answers[question._id]
  ).length;

  /*
   * Count marked questions
   */
  const markedCount = markedQuestions.length;

  return (
    <>
      <Navbar />

      <div className="practice-test-page">

        {/* Header */}

        <div className="practice-test-header">

          <div>
            <h1>Practice Test</h1>

            <p>
              {settings.category || "Practice"}{" "}
              ·{" "}
              {settings.difficulty || "All Levels"}
            </p>
          </div>

          <div
            className={`practice-timer ${
              timeLeft <= 60
                ? "timer-warning"
                : ""
            }`}
          >
            <span>⏱</span>

            <strong>
              {formatTime(timeLeft)}
            </strong>
          </div>

        </div>

        {/* Progress */}

        <div className="practice-progress-section">

          <div className="practice-progress-info">

            <span>
              Question{" "}
              <strong>
                {currentIndex + 1}
              </strong>{" "}
              of {questions.length}
            </span>

            <span>
              {answeredCount}/{questions.length}{" "}
              answered
            </span>

          </div>

          <div className="practice-progress-bar">

            <div
              className="practice-progress-fill"
              style={{
                width: `${
                  ((currentIndex + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />

          </div>

        </div>

        {/* Main layout */}

        <div className="practice-test-layout">

          {/* Question */}

          <main className="practice-question-card">

            <div className="question-card-top">

              <span className="question-number-label">
                Question {currentIndex + 1}
              </span>

              {markedQuestions.includes(
                currentQuestion._id
              ) && (
                <span className="marked-label">
                  🚩 Marked for Review
                </span>
              )}

            </div>

            <h2 className="practice-question-text">
              {currentQuestion.question}
            </h2>

            <div className="practice-options">

              {currentQuestion.options?.map(
                (option, index) => {

                  const isSelected =
                    answers[
                      currentQuestion._id
                    ] === option;

                  return (
                    <button
                      key={index}
                      type="button"
                      className={`practice-option ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleAnswer(option)
                      }
                    >

                      <span className="practice-option-letter">
                        {String.fromCharCode(
                          65 + index
                        )}
                      </span>

                      <span className="practice-option-text">
                        {option}
                      </span>

                      {isSelected && (
                        <span className="selected-check">
                          ✓
                        </span>
                      )}

                    </button>
                  );
                }
              )}

            </div>

            <div className="question-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={handleClearAnswer}
                disabled={
                  !answers[
                    currentQuestion._id
                  ]
                }
              >
                Clear Answer
              </button>

              <button
                type="button"
                className={`review-button ${
                  markedQuestions.includes(
                    currentQuestion._id
                  )
                    ? "marked"
                    : ""
                }`}
                onClick={handleMarkForReview}
              >
                🚩{" "}
                {markedQuestions.includes(
                  currentQuestion._id
                )
                  ? "Unmark"
                  : "Mark for Review"}
              </button>

            </div>

          </main>

          {/* Question Palette */}

          <aside className="question-palette">

            <h3>Questions</h3>

            <div className="palette-grid">

              {questions.map(
                (question, index) => {

                  const isAnswered =
                    Boolean(
                      answers[
                        question._id
                      ]
                    );

                  const isMarked =
                    markedQuestions.includes(
                      question._id
                    );

                  const isCurrent =
                    index === currentIndex;

                  let className =
                    "palette-number";

                  if (isCurrent) {
                    className +=
                      " current";
                  } else if (isMarked) {
                    className +=
                      " marked";
                  } else if (isAnswered) {
                    className +=
                      " answered";
                  }

                  return (
                    <button
                      key={question._id}
                      type="button"
                      className={className}
                      onClick={() =>
                        handleQuestionNavigation(
                          index
                        )
                      }
                    >
                      {index + 1}
                    </button>
                  );
                }
              )}

            </div>

            <div className="palette-legend">

              <div>
                <span className="legend-dot answered-dot" />
                Answered
              </div>

              <div>
                <span className="legend-dot marked-dot" />
                Review
              </div>

              <div>
                <span className="legend-dot unanswered-dot" />
                Unanswered
              </div>

            </div>

            <div className="palette-stats">

              <p>
                Answered{" "}
                <strong>
                  {answeredCount}
                </strong>
              </p>

              <p>
                Marked{" "}
                <strong>
                  {markedCount}
                </strong>
              </p>

              <p>
                Remaining{" "}
                <strong>
                  {questions.length -
                    answeredCount}
                </strong>
              </p>

            </div>

          </aside>

        </div>

        {/* Error */}

        {error && (
          <div className="practice-submit-error">
            {error}
          </div>
        )}

        {/* Navigation */}

        <div className="practice-navigation">

          <button
            type="button"
            className="secondary-button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>

          {currentIndex <
          questions.length - 1 ? (
            <button
              type="button"
              className="primary-button"
              onClick={handleNext}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              className="submit-test-button"
              onClick={() =>
                setShowSubmitModal(true)
              }
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Test"}
            </button>
          )}

        </div>

      </div>

      {/* Submit Confirmation Modal */}

      {showSubmitModal && (
        <div className="modal-overlay">

          <div className="submit-modal">

            <h2>Submit Practice Test?</h2>

            <p>
              You have answered{" "}
              <strong>
                {answeredCount}
              </strong>{" "}
              out of{" "}
              <strong>
                {questions.length}
              </strong>{" "}
              questions.
            </p>

            {answeredCount <
              questions.length && (
              <p className="unanswered-warning">
                ⚠️ You still have{" "}
                <strong>
                  {questions.length -
                    answeredCount}
                </strong>{" "}
                unanswered question
                {questions.length -
                  answeredCount !==
                1
                  ? "s"
                  : ""}
                .
              </p>
            )}

            <div className="modal-actions">

              <button
                className="secondary-button"
                onClick={() =>
                  setShowSubmitModal(false)
                }
              >
                Continue Test
              </button>

              <button
                className="submit-test-button"
                onClick={handleSubmit}
              >
                Submit Test
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default PracticeQuestions;