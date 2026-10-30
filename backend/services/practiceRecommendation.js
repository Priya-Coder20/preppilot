const Question = require("../models/Question");

const SKILL_TO_CATEGORIES = {
    Java: ["Java"],
    DSA: ["DSA"],
    OOP: ["OOP"],
    DBMS: ["DBMS"],
    "Operating Systems": ["Operating System"],
    "Computer Networks": ["Computer Networks"],
    SQL: ["DBMS"],
    "Spring Boot": ["Java"],
    "REST API": ["Java"],
    Python: ["Python"],
    JavaScript: ["JavaScript"]
};

const getPracticeRecommendations = async (recommendations) => {
    const results = [];

    for (const recommendation of recommendations) {
        const categories =
            SKILL_TO_CATEGORIES[recommendation.skill];

        if (!categories) {
            continue;
        }

        const questions = await Question.find({
            category: { $in: categories }
        })
            .select(
                "_id category difficulty type"
            )
            .limit(5)
            .lean();

        results.push({
            skill: recommendation.skill,
            priority: recommendation.priority,
            questions
        });
    }

    return results;
};

module.exports = {
    getPracticeRecommendations
};