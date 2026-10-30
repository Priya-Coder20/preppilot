
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function QuestionBank() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const response = await api.get("/question", {
        params: {
          ...(category && { category }),
          ...(difficulty && { difficulty }),
          ...(type && { type }),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQuestions(response.data.questions);

    } catch (error) {
      console.error("Question bank error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load questions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [category, difficulty, type]);

  const clearFilters = () => {
    setCategory("");
    setDifficulty("");
    setType("");
  };

  return (
    <>
      <Navbar />

      <div className="question-bank-page">

        {/* Header */}
        <div className="question-bank-header">

          <div>
            <h1>Question Bank</h1>

            <p>
              Browse interview questions by category,
              difficulty and type.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/practice")}
          >
            Start Practice
          </button>

        </div>


        {/* Filters */}
        <div className="question-filters">

          <div className="filter-group">

            <label>Category</label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option value="">All Categories</option>
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


          <div className="filter-group">

            <label>Difficulty</label>

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value)
              }
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

          </div>


          <div className="filter-group">

            <label>Type</label>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
            >
              <option value="">All Types</option>
              <option value="MCQ">MCQ</option>
              <option value="Theory">Theory</option>
              <option value="Coding">Coding</option>
            </select>

          </div>


          <button
            className="secondary-button filter-clear"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>


        {/* Question count */}
        <div className="question-count">
          <strong>{questions.length}</strong>{" "}
          question
          {questions.length !== 1 ? "s" : ""} found
        </div>


        {/* Loading */}
        {loading && (
          <div className="question-bank-message">
            <h2>Loading questions...</h2>
          </div>
        )}


        {/* Error */}
        {!loading && error && (
          <div className="question-bank-message">
            <h2>{error}</h2>

            <button
              className="primary-button"
              onClick={fetchQuestions}
            >
              Try Again
            </button>
          </div>
        )}


        {/* Empty */}
        {!loading &&
          !error &&
          questions.length === 0 && (
            <div className="question-bank-message">
              <h2>No questions found</h2>

              <p>
                Try changing the filters.
              </p>
            </div>
          )}


        {/* Questions */}
        {!loading &&
          !error &&
          questions.length > 0 && (

            <div className="question-bank-list">

              {questions.map((question, index) => (

                <div
                  className="question-bank-card"
                  key={question._id}
                >

                  <div className="question-bank-card-header">

                    <span className="question-number">
                      Question {index + 1}
                    </span>

                    <span
                      className={`difficulty-badge ${question.difficulty.toLowerCase()}`}
                    >
                      {question.difficulty}
                    </span>

                  </div>


                  <h3>
                    {question.question}
                  </h3>


                  <div className="question-meta">

                    <span>
                      Category:{" "}
                      <strong>
                        {question.category}
                      </strong>
                    </span>

                    <span>
                      Type:{" "}
                      <strong>
                        {question.type}
                      </strong>
                    </span>

                  </div>


                  {question.type === "MCQ" &&
                    question.options?.length > 0 && (

                      <div className="bank-options">

                        {question.options.map(
                          (option, optionIndex) => (

                            <div
                              className="bank-option"
                              key={optionIndex}
                            >
                              <span>
                                {String.fromCharCode(
                                  65 + optionIndex
                                )}
                              </span>

                              <p>{option}</p>
                            </div>

                          )
                        )}

                      </div>

                    )}

                </div>

              ))}

            </div>

          )}

      </div>
    </>
  );
}

export default QuestionBank;

