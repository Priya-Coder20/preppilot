
function AIResumeReview({ aiReview }) {
    if (!aiReview) {
        return null;
    }

    if (aiReview.error) {
        return (
            <div className="analysis-card">
                <h3>AI Resume Review</h3>
                <p>{aiReview.error}</p>
            </div>
        );
    }

    const sections = [
        {
            title: "Strengths",
            items: aiReview.strengths,
        },
        {
            title: "Areas for Improvement",
            items: aiReview.improvements,
        },
        {
            title: "Project Feedback",
            items: aiReview.projectFeedback,
        },
        {
            title: "Information You Could Add",
            items: aiReview.missingInformation,
        },
    ];

    return (
        <div className="analysis-card ai-review-card">
            <h3>AI Resume Review</h3>

            <p className="ai-review-intro">
                Personalized feedback generated from your uploaded resume.
            </p>

            {aiReview.summary && (
                <div className="ai-review-summary">
                    <h4>Overall Assessment</h4>
                    <p>{aiReview.summary}</p>
                </div>
            )}

            {sections.map((section) => (
                <div className="ai-review-section" key={section.title}>
                    <h4>{section.title}</h4>

                    {Array.isArray(section.items) &&
                    section.items.length > 0 ? (
                        <ul>
                            {section.items.map((item, index) => (
                                <li key={`${section.title}-${index}`}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No specific feedback available.</p>
                    )}
                </div>
            ))}

            {aiReview.targetRoleFit && (
                <div className="ai-review-section">
                    <h4>Target Role Fit</h4>
                    <p>{aiReview.targetRoleFit}</p>
                </div>
            )}
        </div>
    );
}

export default AIResumeReview;
