const Question = require("../models/Question");
const Attempt = require("../models/Attempt");


// Start practice
const startPractice = async (req, res) => {
    try {
        const { category, difficulty, limit = 5 } = req.query;

        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (difficulty) {
            filter.difficulty = difficulty;
        }

        const questions = await Question.aggregate([
            { $match: filter },
            { $sample: { size: Number(limit) } }
        ]);

        res.status(200).json({
            count: questions.length,
            questions
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to start practice",
            error: error.message
        });
    }
};


// Submit practice
const submitPractice = async (req, res) => {
    try {
        const {
            category,
            difficulty,
            answers
        } = req.body;

        let correctAnswers = 0;

        const processedAnswers = [];

        for (const answer of answers) {

            const question = await Question.findById(answer.questionId);

            if (!question) {
                continue;
            }

            const isCorrect =
                question.correctAnswer === answer.selectedAnswer;

            if (isCorrect) {
                correctAnswers++;
            }

            processedAnswers.push({
                question: question._id,
                selectedAnswer: answer.selectedAnswer,
                isCorrect
            });
        }

        const totalQuestions = answers.length;

        const score =
            totalQuestions === 0
                ? 0
                : Math.round((correctAnswers / totalQuestions) * 100);

        const attempt = await Attempt.create({
            user: req.userId,
            category,
            difficulty,
            totalQuestions,
            correctAnswers,
            score,
            answers: processedAnswers
        });

        res.status(201).json({
            message: "Practice submitted successfully",
            result: {
                totalQuestions,
                correctAnswers,
                wrongAnswers: totalQuestions - correctAnswers,
                score
            },
            attemptId: attempt._id
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to submit practice",
            error: error.message
        });
    }
};


module.exports = {
    startPractice,
    submitPractice
};