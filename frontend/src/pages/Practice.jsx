import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Practice() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "DSA",
    difficulty: "Easy",
    questionCount: 5,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStart = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.get("/practice/start", {
        params: {
          category: formData.category,
          difficulty: formData.difficulty,
          limit: formData.questionCount,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Practice questions:", response.data);

      const questions = response.data.questions || [];

      if (questions.length === 0) {
        setError(
          "No questions found for the selected category and difficulty."
        );
        return;
      }

      localStorage.setItem(
        "practiceQuestions",
        JSON.stringify(questions)
      );

      localStorage.setItem(
        "practiceSettings",
        JSON.stringify(formData)
      );

      navigate("/practice/questions");
    } catch (error) {
      console.error("Failed to start practice:", error);

      setError(
        error.response?.data?.message ||
          "Failed to start practice."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="practice-page">

        <div className="practice-header">
          <h1>Start Practice</h1>

          <p>
            Test your interview preparation with
            category-based practice questions.
          </p>
        </div>

        <div className="practice-card">

          <div className="practice-card-header">
            <h2>Practice Setup</h2>

            <p>
              Choose your preferences before starting.
            </p>
          </div>

          <form onSubmit={handleStart}>

            {/* Category */}

            <div className="practice-field">
              <label>Category</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="DSA">DSA</option>
                <option value="OOP">OOP</option>
                <option value="DBMS">DBMS</option>
                <option value="Operating System">
                  Operating System
                </option>
                <option value="Computer Networks">
                  Computer Networks
                </option>
                <option value="Java">Java</option>
                <option value="HR">HR</option>
              </select>
            </div>

            {/* Difficulty */}

            <div className="practice-field">
              <label>Difficulty</label>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Question Count */}

            <div className="practice-field">
              <label>Number of Questions</label>

              <select
                name="questionCount"
                value={formData.questionCount}
                onChange={handleChange}
              >
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="20">20 Questions</option>
              </select>
            </div>

            {error && (
              <div className="practice-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="primary-button practice-start-button"
              disabled={loading}
            >
              {loading
                ? "Loading Questions..."
                : "Start Practice"}
            </button>

          </form>

        </div>

        <div className="practice-info">

          <div className="practice-info-card">
            <h3>🎯 Focused Practice</h3>
            <p>
              Practice questions based on your selected
              technical category.
            </p>
          </div>

          <div className="practice-info-card">
            <h3>📊 Track Performance</h3>
            <p>
              Your results are automatically saved to
              your dashboard.
            </p>
          </div>

          <div className="practice-info-card">
            <h3>💡 Learn From Mistakes</h3>
            <p>
              Review your answers and explanations after
              completing a practice session.
            </p>
          </div>

        </div>

        <button
          className="secondary-button practice-back-button"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>

      </div>
    </>
  );
}

export default Practice;