const Attempt = require("../models/Attempt");

const getDashboard = async (req, res) => {
    try {
        const userId = req.userId;

        const attempts = await Attempt.find({
            user: userId
        }).sort({ createdAt: -1 });

        // No attempts yet
        if (attempts.length === 0) {
            return res.status(200).json({
                totalAttempts: 0,
                totalQuestions: 0,
                correctAnswers: 0,
                accuracy: 0,
                averageScore: 0,
                bestScore: 0,
                categoryPerformance: [],
                recentAttempts: []
            });
        }

        // Total questions
        const totalQuestions = attempts.reduce(
            (sum, attempt) => sum + attempt.totalQuestions,
            0
        );

        // Total correct answers
        const correctAnswers = attempts.reduce(
            (sum, attempt) => sum + attempt.correctAnswers,
            0
        );

        // Accuracy
        const accuracy =
            totalQuestions === 0
                ? 0
                : Math.round(
                    (correctAnswers / totalQuestions) * 100
                );

        // Average score
        const totalScore = attempts.reduce(
            (sum, attempt) => sum + attempt.score,
            0
        );

        const averageScore = Math.round(
            totalScore / attempts.length
        );

        // Best score
        const bestScore = Math.max(
            ...attempts.map((attempt) => attempt.score)
        );

        // Category performance
        const categoryMap = {};

        attempts.forEach((attempt) => {
            if (!categoryMap[attempt.category]) {
                categoryMap[attempt.category] = {
                    category: attempt.category,
                    attempts: 0,
                    questions: 0,
                    correct: 0
                };
            }

            categoryMap[attempt.category].attempts += 1;

            categoryMap[attempt.category].questions +=
                attempt.totalQuestions;

            categoryMap[attempt.category].correct +=
                attempt.correctAnswers;
        });

        const categoryPerformance = Object.values(categoryMap).map(
            (item) => ({
                category: item.category,
                attempts: item.attempts,
                questions: item.questions,
                correct: item.correct,
                accuracy:
                    item.questions === 0
                        ? 0
                        : Math.round(
                            (item.correct / item.questions) * 100
                        )
            })
        );

        // Recent 5 attempts
        const recentAttempts = attempts
            .slice(0, 5)
            .map((attempt) => ({
                id: attempt._id,
                category: attempt.category,
                difficulty: attempt.difficulty,
                totalQuestions: attempt.totalQuestions,
                correctAnswers: attempt.correctAnswers,
                score: attempt.score,
                createdAt: attempt.createdAt
            }));

        res.status(200).json({
            totalAttempts: attempts.length,
            totalQuestions,
            correctAnswers,
            accuracy,
            averageScore,
            bestScore,
            categoryPerformance,
            recentAttempts
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            message: "Failed to load dashboard",
            error: error.message
        });
    }
};


const getAttemptDetails = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const userId = req.userId;

        const attempt = await Attempt.findOne({
            _id: attemptId,
            user: userId
        }).populate(
            "answers.question",
            "question category difficulty options correctAnswer explanation"
        );

        if (!attempt) {
            return res.status(404).json({
                message: "Attempt not found"
            });
        }

        res.status(200).json({
            id: attempt._id,
            category: attempt.category,
            difficulty: attempt.difficulty,
            totalQuestions: attempt.totalQuestions,
            correctAnswers: attempt.correctAnswers,
            score: attempt.score,
            createdAt: attempt.createdAt,
            answers: attempt.answers
        });

    } catch (error) {
        console.error("Attempt details error:", error);

        res.status(500).json({
            message: "Failed to load attempt details",
            error: error.message
        });
    }
};
module.exports = {
    getDashboard,
    getAttemptDetails
};