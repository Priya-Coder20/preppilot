
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function AttemptDetails() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const response = await api.get(
          `/dashboard/attempt/${attemptId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Attempt details:", response.data);

        setAttempt(response.data);

      } catch (error) {
        console.error("Attempt details error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load attempt details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [attemptId, navigate]);

  // Loading
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="attempt-details-page">
          <h2>Loading attempt...</h2>
        </div>
      </>
    );
  }

  // Error
  if (error) {
    return (
      <>
        <Navbar />

        <div className="attempt-details-page">
          <h2>{error}</h2>

          <button
            className="secondary-button"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </>
    );
  }

  if (!attempt) {
    return null;
  }

  return (
    <>
      <Navbar />

      <div className="attempt-details-page">

        {/* Header */}
        <div className="attempt-details-header">

          <div>
            <h1>Practice Details</h1>

            <p>
              {attempt.category} · {attempt.difficulty}
            </p>
          </div>

          <button
            className="secondary-button"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>

        </div>


        {/* Score Summary */}
        <div className="attempt-summary">

          <div className="summary-card">
            <h3>Score</h3>
            <p>{attempt.score}%</p>
          </div>

          <div className="summary-card">
            <h3>Total Questions</h3>
            <p>{attempt.totalQuestions}</p>
          </div>

          <div className="summary-card">
            <h3>Correct Answers</h3>
            <p>{attempt.correctAnswers}</p>
          </div>

          <div className="summary-card">
            <h3>Wrong Answers</h3>
            <p>
              {attempt.totalQuestions -
                attempt.correctAnswers}
            </p>
          </div>

        </div>


        {/* Question Review */}
        <section className="questions-section">

          <h2>Question Review</h2>

          {attempt.answers.map((answer, index) => {

            const question = answer.question;

            if (!question) {
              return (
                <div
                  className="review-card"
                  key={index}
                >
                  <h3>
                    Question {index + 1}
                  </h3>

                  <p>
                    Question information is unavailable.
                  </p>
                </div>
              );
            }

            return (
              <div
                className={`review-card ${
                  answer.isCorrect
                    ? "review-correct"
                    : "review-incorrect"
                }`}
                key={index}
              >

                {/* Question heading */}
                <div className="review-card-header">

                  <h3>
                    Question {index + 1}
                  </h3>

                  <span
                    className={
                      answer.isCorrect
                        ? "review-badge correct"
                        : "review-badge incorrect"
                    }
                  >
                    {answer.isCorrect
                      ? "✓ Correct"
                      : "✗ Incorrect"}
                  </span>

                </div>


                {/* Question */}
                <p className="review-question">
                  {question.question}
                </p>


                {/* Options */}
                {question.options &&
                  question.options.length > 0 && (

                    <div className="review-options">

                      {question.options.map(
                        (option, optionIndex) => {

                          const isSelected =
                            option ===
                            answer.selectedAnswer;

                          const isCorrect =
                            option ===
                            question.correctAnswer;

                          let optionClass =
                            "review-option";

                          if (isCorrect) {
                            optionClass +=
                              " option-correct";
                          } else if (isSelected) {
                            optionClass +=
                              " option-incorrect";
                          }

                          return (
                            <div
                              key={optionIndex}
                              className={optionClass}
                            >

                              <span className="option-label">
                                {String.fromCharCode(
                                  65 + optionIndex
                                )}
                              </span>

                              <span className="option-text">
                                {option}
                              </span>

                              {isCorrect && (
                                <span className="option-result">
                                  ✓ Correct Answer
                                </span>
                              )}

                              {!isCorrect &&
                                isSelected && (
                                  <span className="option-result">
                                    ✗ Your Answer
                                  </span>
                                )}

                            </div>
                          );
                        }
                      )}

                    </div>
                  )}


                {/* Answer information */}
                <div className="answer-row">

                  <div>
                    <strong>Your Answer:</strong>

                    <p>
                      {answer.selectedAnswer ||
                        "Not answered"}
                    </p>
                  </div>

                  <div>
                    <strong>Correct Answer:</strong>

                    <p>
                      {question.correctAnswer}
                    </p>
                  </div>

                </div>


                {/* Status */}
                <div
                  className={
                    answer.isCorrect
                      ? "answer-status correct"
                      : "answer-status incorrect"
                  }
                >
                  {answer.isCorrect
                    ? "✓ Your answer is correct"
                    : "✗ Your answer is incorrect"}
                </div>


                {/* Explanation */}
                {question.explanation && (
                  <div className="explanation">

                    <strong>
                      Explanation
                    </strong>

                    <p>
                      {question.explanation}
                    </p>

                  </div>
                )}

              </div>
            );
          })}

        </section>

      </div>
    </>
  );
}

export default AttemptDetails;

