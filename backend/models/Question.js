const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: true,
        trim: true
    },

    category:{
        type: String,
        required: true,
        enum:[
            "DSA",
            "OOP",
            "DBMS",
            "Operating System",
            "Computer Networks",
            "Java",
            "HR"
        ]
    },
    difficulty:{
        type: String,
        required: true,
        enum:["Easy", "Medium", "Hard"]
    },
    type: {
        type: String,
        enum: ["MCQ", "Theory", "Coding"],
        default: "MCQ"
    },
    options: [
        {
            type: String
        }
    ],
    correctAnswer: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        default: ""
    }
    }, 
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Question", questionSchema);