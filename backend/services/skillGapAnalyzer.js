const { ROLE_REQUIREMENTS } = require("./roleRequirements");

const analyzeSkillGap = (resumeSkills, targetRole) => {
    if (!targetRole) {
        throw new Error("Target role is required.");
    }

    const role = ROLE_REQUIREMENTS[targetRole];

    if (!role) {
        throw new Error(`Unsupported target role: ${targetRole}`);
    }

    const normalizedResumeSkills = resumeSkills.map(skill =>
        skill.toLowerCase()
    );

    const requiredMatched = [];
    const requiredMissing = [];

    const preferredMatched = [];
    const preferredMissing = [];

    // Check required skills
    for (const skill of role.required) {
        if (normalizedResumeSkills.includes(skill.toLowerCase())) {
            requiredMatched.push(skill);
        } else {
            requiredMissing.push(skill);
        }
    }

    // Check preferred skills
    for (const skill of role.preferred) {
        if (normalizedResumeSkills.includes(skill.toLowerCase())) {
            preferredMatched.push(skill);
        } else {
            preferredMissing.push(skill);
        }
    }

    // Required skill score
    const requiredScore =
        role.required.length === 0
            ? 100
            : Math.round(
                  (requiredMatched.length / role.required.length) * 100
              );

    // Preferred skill score
    const preferredScore =
        role.preferred.length === 0
            ? 100
            : Math.round(
                  (preferredMatched.length / role.preferred.length) * 100
              );

    // Overall score
    const overallScore = Math.round(
        requiredScore * 0.8 +
        preferredScore * 0.2
    );

    let readiness;

    if (overallScore >= 85) {
        readiness = "Excellent";
    } else if (overallScore >= 70) {
        readiness = "Good";
    } else if (overallScore >= 50) {
        readiness = "Needs Improvement";
    } else {
        readiness = "Needs Significant Improvement";
    }

    return {
        targetRole,

        score: {
            overall: overallScore,
            required: requiredScore,
            preferred: preferredScore
        },

        readiness,

        requiredSkills: {
            total: role.required.length,
            matched: requiredMatched,
            missing: requiredMissing
        },

        preferredSkills: {
            total: role.preferred.length,
            matched: preferredMatched,
            missing: preferredMissing
        }
    };
};

module.exports = {
    analyzeSkillGap
}; 