const parseResume = require("../services/resumeParser");
const { analyzeResumeText } = require("../services/resumeAnalyzer");
const { extractSkills } = require("../services/skillExtractor");
const { analyzeSkillGap } = require("../services/skillGapAnalyzer");
const { generateRecommendations } = require("../services/recommendationEngine");
const { analyzeResumeWithAI } = require("../services/aiResumeAnalyzer");

const {
    getPracticeRecommendations
} = require("../services/practiceRecommendation");

// const recommendations = generateRecommendations(
//     skillGap
// );

const {
    extractResumeData
} = require("../services/resumeDataExtractor");

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a resume."
            });
        }

        const targetRole = req.body.targetRole || "Java Developer";

        // 1. Extract resume text
        const parsedResume = await parseResume(req.file);

        if (!parsedResume.text) {
            return res.status(400).json({
                message: "Could not extract readable text from this resume."
            });
        }

        // 2. Detect resume sections
        const analysis = analyzeResumeText(parsedResume.text);

        // 3. Extract normalized skills
        const skills = extractSkills(parsedResume.text);

        const resumeData = extractResumeData(
            parsedResume.text,
            analysis.sections,
            skills
        );

        let aiReview;

        try {

            console.log("STEP 2: Calling Ollama AI...");
            aiReview = await analyzeResumeWithAI(
                parsedResume.text,
                targetRole
            );

            console.log("STEP 3: AI review completed");
        } catch (aiError) {
            console.error("AI resume analysis failed:", aiError);

            aiReview = {
                error: "AI review is temporarily unavailable."
            };
        }

        // 4. Compare resume skills with target role
        const skillGap = analyzeSkillGap(
            skills,
            targetRole
        );

        // 5. Generate personalized recommendations
        const recommendations = generateRecommendations(
            skillGap
        );

        const practiceRecommendations =
        await getPracticeRecommendations(
            recommendations
        );
        // 6. Return complete analysis
        res.status(200).json({
            message: "Resume analyzed successfully",

            resume: {
                fileName: req.file.originalname,
                fileType: parsedResume.fileType,
                pages: parsedResume.pages,
                textLength: parsedResume.text.length,

                analysis: {
                    sections: analysis.sections,

                    statistics: analysis.statistics,

                    resumeData,
                    skills,

                    targetRole,

                    skillGap,

                    recommendations,

                    practiceRecommendations,

                    aiReview,
                }
            }
        });

    } catch (error) {
        console.error(
            "Resume analysis error:",
            error
        );

        res.status(500).json({
            message: "Failed to analyze resume.",
            error: error.message
        });
    }
};

module.exports = {
    uploadResume
};