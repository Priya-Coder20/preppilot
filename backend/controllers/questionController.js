const Question = require("../models/Question");

const createQuestion = async (req, res) =>{
    try{
        const question = await Question.create(req.body);

        res.status(201).json({
            message: "Question created successfully",
            question
        });
    }catch (error){
        res.status(500).json({
            message: "Failed to create question",
            error: error.message
        });
    }
};

const getQuestions = async (req, res) => {
    try {
        const { category, difficulty, type } = req.query;

        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (difficulty) {
            filter.difficulty = difficulty;
        }

        if (type) {
            filter.type = type;
        }

        const questions = await Question.find(filter);

        res.status(200).json({
            count: questions.length,
            filters: {
                category: category || "All",
                difficulty: difficulty || "All",
                type: type || "All"
            },
            questions
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get questions",
            error: error.message
        });
    }
};

module.exports= {
    createQuestion,
    getQuestions
};