
function ResumeUploadForm({
    targetRole,
    onTargetRoleChange,
    file,
    onFileChange,
    error,
    loading,
    onAnalyze
}) {
    return (
        <div className="resume-upload-card">
            <h2>Analyze Your Resume</h2>

            <p className="resume-description">
                Upload your latest resume and let PrepPilot
                identify your skills, strengths, gaps, and
                recommended preparation areas.
            </p>

            <div className="resume-form">
                <div className="form-group">
                    <label htmlFor="targetRole">
                        Target Role
                    </label>

                    <select
                        id="targetRole"
                        value={targetRole}
                        onChange={(event) =>
                            onTargetRoleChange(event.target.value)
                        }
                    >
                        <option>Java Developer</option>
                        <option>Full Stack Developer</option>
                        <option>Backend Developer</option>
                        <option>Frontend Developer</option>
                        <option>Data Analyst</option>
                        <option>AI/ML Engineer</option>
                        <option>Software Engineer</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="resumeFile">
                        Resume
                    </label>

                    <input
                        id="resumeFile"
                        type="file"
                        accept=".pdf,.docx"
                        onChange={onFileChange}
                    />

                    {file && (
                        <p className="selected-file">
                            Selected: {file.name}
                        </p>
                    )}
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <button
                    type="button"
                    className="primary-btn"
                    onClick={onAnalyze}
                    disabled={loading}
                >
                    {loading
                        ? "Analyzing Resume..."
                        : "Analyze Resume"}
                </button>
            </div>
        </div>
    );
}

export default ResumeUploadForm;
