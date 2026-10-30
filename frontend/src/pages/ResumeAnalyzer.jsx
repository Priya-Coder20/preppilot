
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ResumeUploadForm from "../components/resume/ResumeUploadForm";
import AIResumeReview from "../components/resume/AIResumeReview";

function ResumeAnalyzer() {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [targetRole, setTargetRole] = useState("Java Developer");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Validate the selected resume.
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        setError("");
        setResult(null);

        if (!selectedFile) {
            setFile(null);
            return;
        }

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (!allowedTypes.includes(selectedFile.type)) {
            setFile(null);
            event.target.value = "";
            setError("Only PDF and DOCX files are supported.");
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setFile(null);
            event.target.value = "";
            setError("Resume size must be less than 5 MB.");
            return;
        }

        setFile(selectedFile);
    };

    // Send the resume to the backend for analysis.
    const handleAnalyze = async () => {
        if (!file) {
            setError("Please select a resume first.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResult(null);

            const formData = new FormData();
            formData.append("resume", file);
            formData.append("targetRole", targetRole);

            const token = localStorage.getItem("token");

            const response = await api.post(
                "/resume/upload",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setResult(response.data.resume);
        } catch (error) {
            console.error("Resume analysis error:", error);

            setError(
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to analyze resume."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="resume-page">

            {/* Page heading */}
            <div className="resume-header">
                <div>
                    <h1>Resume Analyzer</h1>

                    <p>
                        Analyze your resume against your target
                        career role and discover your skill gaps.
                    </p>
                </div>

                <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>

            {/* Upload form component */}
            <ResumeUploadForm
                targetRole={targetRole}
                onTargetRoleChange={setTargetRole}
                file={file}
                onFileChange={handleFileChange}
                error={error}
                loading={loading}
                onAnalyze={handleAnalyze}
            />

            {/* Display results only after successful analysis */}
            {result && result.analysis && (
                <div className="resume-results">

                    {/* Result heading */}
                    <div className="result-header">
                        <div>
                            <h2>Resume Analysis</h2>
                            <p>{result.fileName}</p>
                        </div>

                        <div className="role-badge">
                            {result.analysis.targetRole}
                        </div>
                    </div>

                    {/* Readiness score */}
                    <div className="score-card">
                        <div className="score-circle">
                            <strong>
                                {result.analysis.skillGap.score.overall}%
                            </strong>

                            <span>Readiness</span>
                        </div>

                        <div className="score-info">
                            <h3>
                                {result.analysis.skillGap.readiness}
                            </h3>

                            <p>
                                Your resume currently matches the
                                configured requirements for your
                                selected role.
                            </p>
                        </div>
                    </div>

                    {/* Matched and missing skills */}
                    <div className="analysis-grid">

                        <div className="analysis-card">
                            <h3>Matched Skills</h3>

                            <div className="skill-list">
                                {result.analysis.skillGap.requiredSkills.matched.map(
                                    (skill) => (
                                        <span
                                            className="skill-tag matched"
                                            key={skill}
                                        >
                                            ✓ {skill}
                                        </span>
                                    )
                                )}

                                {result.analysis.skillGap.requiredSkills.matched.length === 0 && (
                                    <p>No matched skills found.</p>
                                )}
                            </div>
                        </div>

                        <div className="analysis-card">
                            <h3>Missing Skills</h3>

                            <div className="skill-list">
                                {result.analysis.skillGap.requiredSkills.missing.length === 0 ? (
                                    <p>No required skill gaps found.</p>
                                ) : (
                                    result.analysis.skillGap.requiredSkills.missing.map(
                                        (skill) => (
                                            <span
                                                className="skill-tag missing"
                                                key={skill}
                                            >
                                                + {skill}
                                            </span>
                                        )
                                    )
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Recommended preparation */}
                    <div className="analysis-card">
                        <h3>Recommended Preparation</h3>

                        {result.analysis.recommendations.length === 0 ? (
                            <p>
                                Your resume currently covers all
                                configured requirements for this role.
                            </p>
                        ) : (
                            <div className="recommendation-list">
                                {result.analysis.recommendations.map(
                                    (recommendation) => (
                                        <div
                                            className="recommendation-item"
                                            key={recommendation.skill}
                                        >
                                            <div>
                                                <h4>
                                                    {recommendation.skill}
                                                </h4>

                                                <span
                                                    className={`priority ${recommendation.priority.toLowerCase()}`}
                                                >
                                                    {recommendation.priority}
                                                </span>
                                            </div>

                                            <p>
                                                {recommendation.reason}
                                            </p>

                                            <div className="topic-list">
                                                {recommendation.topics.map(
                                                    (topic) => (
                                                        <span key={topic}>
                                                            {topic}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Practice questions */}
                    <div className="analysis-card">
                        <h3>Practice From Your Skill Gaps</h3>

                        {result.analysis.practiceRecommendations.length === 0 ? (
                            <p>
                                No matching practice questions are
                                available yet.
                            </p>
                        ) : (
                            result.analysis.practiceRecommendations.map(
                                (practice) => (
                                    <div
                                        className="practice-recommendation"
                                        key={practice.skill}
                                    >
                                        <div>
                                            <h4>{practice.skill}</h4>

                                            <p>
                                                {practice.questions.length}{" "}
                                                practice questions available
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="secondary-btn"
                                            onClick={() =>
                                                navigate("/question-bank")
                                            }
                                        >
                                            Practice
                                        </button>
                                    </div>
                                )
                            )
                        )}
                    </div>

                    
                    <AIResumeReview
                        aiReview={result.analysis.aiReview}
                    />

                </div>
            )}

        </div>
    );
}

export default ResumeAnalyzer;
