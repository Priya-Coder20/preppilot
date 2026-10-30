import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Result() {
  const navigate = useNavigate();

  const result = JSON.parse(
    localStorage.getItem("practiceResult") || "null"
  );

  const attemptId = localStorage.getItem("attemptId");

  const settings = JSON.parse(
    localStorage.getItem("practiceSettings") || "{}"
  );

  useEffect(() => {
    if (!result) {
      navigate("/practice");
    }
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  const {
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    score,
  } = result;

  const unanswered =
    totalQuestions -
    correctAnswers -
    wrongAnswers;

  const getMessage = () => {
    if (score === 100) {
      return {
        title: "Excellent performance!",
        message:
          "You answered every question correctly. Keep this consistency going.",
      };
    }

    if (score >= 80) {
      return {
        title: "Great job!",
        message:
          "Your fundamentals look strong. Keep practicing to become even more consistent.",
      };
    }

    if (score >= 60) {
      return {
        title: "Good attempt!",
        message:
          "You have a good foundation. Focus on the questions you missed and keep practicing.",
      };
    }

    if (score >= 40) {
      return {
        title: "Keep practicing!",
        message:
          "You're making progress. Review the concepts behind your incorrect answers.",
      };
    }

    return {
      title: "Practice makes progress!",
      message:
        "Don't worry about the score. Review your mistakes and use them to strengthen your fundamentals.",
    };
  };

  const performance = getMessage();

  return (
    <>
      <Navbar />

      <div className="result-page">

        {/* Header */}

        <div className="result-container">

          <div className="result-header">

            <p className="result-label">
              PRACTICE COMPLETE
            </p>

            <h1>{performance.title}</h1>

            <p className="result-subtitle">
              {settings.category || "Interview Practice"}
              {" · "}
              {settings.difficulty || "All Levels"}
            </p>

          </div>

          {/* Score */}

          <div className="result-main-card">

            <div className="score-ring"
            style={{
              "--score":score,
            }}>

              <div className="score-ring-inner">

                <span className="score-value">
                  {score}%
                </span>

                <span className="score-label">
                  Score
                </span>

              </div>

            </div>

            <p className="result-message">
              {performance.message}
            </p>

          </div>

          {/* Statistics */}

          <div className="result-stats-grid">

            <div className="result-stat-card">
              <span className="result-stat-icon">
                📋
              </span>

              <div>
                <p>Total Questions</p>
                <strong>{totalQuestions}</strong>
              </div>
            </div>

            <div className="result-stat-card correct-stat">
              <span className="result-stat-icon">
                ✓
              </span>

              <div>
                <p>Correct</p>
                <strong>{correctAnswers}</strong>
              </div>
            </div>

            <div className="result-stat-card wrong-stat">
              <span className="result-stat-icon">
                ✕
              </span>

              <div>
                <p>Wrong</p>
                <strong>{wrongAnswers}</strong>
              </div>
            </div>

            <div className="result-stat-card unanswered-stat">
              <span className="result-stat-icon">
                ○
              </span>

              <div>
                <p>Unanswered</p>
                <strong>{unanswered}</strong>
              </div>
            </div>

          </div>

          {/* Performance */}

          <div className="performance-card">

            <div className="performance-header">
              <div>
                <h2>Performance Summary</h2>

                <p>
                  Here's how you performed in this
                  practice session.
                </p>
              </div>
            </div>

            <div className="performance-bar-section">

              <div className="performance-bar-label">
                <span>Accuracy</span>

                <strong>{score}%</strong>
              </div>

              <div className="performance-bar">
                <div
                  className="performance-bar-fill"
                  style={{
                    width: `${score}%`,
                  }}
                />
              </div>

            </div>

            <div className="performance-details">

              <div>
                <span>Category</span>
                <strong>
                  {settings.category || "N/A"}
                </strong>
              </div>

              <div>
                <span>Difficulty</span>
                <strong>
                  {settings.difficulty || "N/A"}
                </strong>
              </div>

              <div>
                <span>Questions</span>
                <strong>
                  {totalQuestions}
                </strong>
              </div>

            </div>

          </div>

          {/* Actions */}

          <div className="result-actions">

            {attemptId && (
              <button
                className="primary-button"
                onClick={() =>
                  navigate(
                    `/attempt/${attemptId}`
                  )
                }
              >
                Review Answers
              </button>
            )}

            <button
              className="secondary-button"
              onClick={() =>
                navigate("/practice")
              }
            >
              Try Again
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Dashboard
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

export default Result;