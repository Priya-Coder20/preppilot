import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const response = await api.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Dashboard data:", response.data);

        setDashboard(response.data);
      } catch (error) {
        console.error("Dashboard error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="dashboard-page">
          <div className="dashboard-message">
            <h2>Loading dashboard...</h2>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <div className="dashboard-page">
          <div className="dashboard-message">
            <h2>{error}</h2>

            <button
              className="primary-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <>
      <Navbar />

      <div className="dashboard-page">

        {/* Header */}

        <div className="dashboard-header">

          <div>
            <p className="dashboard-label">
              YOUR PROGRESS
            </p>

            <h1>Interview Preparation Dashboard</h1>

            <p>
              Track your practice performance and
              improve your interview readiness.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/practice")}
          >
            Start Practice
          </button>

        </div>

        {/* Statistics */}

        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Attempts</span>
              <span className="stat-icon">📋</span>
            </div>

            <p>{dashboard.totalAttempts}</p>

            <small>
              Practice sessions completed
            </small>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Questions</span>
              <span className="stat-icon">❓</span>
            </div>

            <p>{dashboard.totalQuestions}</p>

            <small>
              Questions attempted
            </small>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Accuracy</span>
              <span className="stat-icon">🎯</span>
            </div>

            <p>{dashboard.accuracy}%</p>

            <small>
              Overall accuracy
            </small>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Average Score</span>
              <span className="stat-icon">📊</span>
            </div>

            <p>{dashboard.averageScore}%</p>

            <small>
              Across all attempts
            </small>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Best Score</span>
              <span className="stat-icon">🏆</span>
            </div>

            <p>{dashboard.bestScore}%</p>

            <small>
              Highest practice score
            </small>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Correct Answers</span>
              <span className="stat-icon">✓</span>
            </div>

            <p>{dashboard.correctAnswers}</p>

            <small>
              Correct responses
            </small>
          </div>

        </section>

        {/* Category Performance */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>
              <h2>Category Performance</h2>

              <p>
                See how you're performing across
                different interview topics.
              </p>
            </div>

          </div>

          {dashboard.categoryPerformance.length ===
          0 ? (
            <div className="dashboard-empty">
              <h3>No practice data yet</h3>

              <p>
                Complete your first practice session
                to see category performance.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  navigate("/practice")
                }
              >
                Start Your First Practice
              </button>
            </div>
          ) : (
            <div className="category-performance-grid">

              {dashboard.categoryPerformance.map(
                (category) => (
                  <div
                    className="category-performance-card"
                    key={category.category}
                  >

                    <div className="category-card-heading">

                      <div>
                        <h3>
                          {category.category}
                        </h3>

                        <p>
                          {category.correct}/
                          {category.questions} correct
                        </p>
                      </div>

                      <strong>
                        {category.accuracy}%
                      </strong>

                    </div>

                    <div className="category-progress">

                      <div
                        className="category-progress-fill"
                        style={{
                          width: `${category.accuracy}%`,
                        }}
                      />

                    </div>

                    <div className="category-card-footer">

                      <span>
                        {category.attempts} attempt
                        {category.attempts !== 1
                          ? "s"
                          : ""}
                      </span>

                      <span>
                        Accuracy
                      </span>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* Recent Attempts */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>
              <h2>Recent Practice</h2>

              <p>
                Review your latest practice sessions.
              </p>
            </div>

            <button
              className="secondary-button"
              onClick={() => navigate("/practice")}
            >
              New Practice
            </button>

          </div>

          {dashboard.recentAttempts.length ===
          0 ? (
            <div className="dashboard-empty">
              <h3>No attempts yet</h3>

              <p>
                Your completed practice sessions will
                appear here.
              </p>
            </div>
          ) : (
            <div className="attempt-list">

              {dashboard.recentAttempts.map(
                (attempt) => (
                  <div
                    className="attempt-card"
                    key={attempt.id}
                  >

                    <div className="attempt-main">

                      <div className="attempt-category">
                        {attempt.category}
                      </div>

                      <div className="attempt-info">

                        <strong>
                          {attempt.difficulty}
                        </strong>

                        <span>•</span>

                        <span>
                          {attempt.correctAnswers}/
                          {attempt.totalQuestions}
                          {" "}correct
                        </span>

                        <span>•</span>

                        <span>
                          {new Date(
                            attempt.createdAt
                          ).toLocaleDateString()}
                        </span>

                      </div>

                    </div>

                    <div className="attempt-actions">

                      <div className="attempt-score">
                        {attempt.score}%
                      </div>

                      <button
                        className="details-button"
                        onClick={() =>
                          navigate(
                            `/attempt/${attempt.id}`
                          )
                        }
                      >
                        View Details
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

      </div>
    </>
  );
}

export default Dashboard;