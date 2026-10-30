const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        category: {
            type: String,
            required: true
        },

        difficulty: {
            type: String,
            required: true
        },

        totalQuestions: {
            type: Number,
            required: true
        },

        correctAnswers: {
            type: Number,
            required: true
        },

        score: {
            type: Number,
            required: true
        },

        answers: [
            {
                question: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question"
                },

                selectedAnswer: {
                    type: String
                },

                isCorrect: {
                    type: Boolean
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Attempt", attemptSchema);