const SKILL_PRIORITIES = {
    "Java": {
        priority: "High",
        reason: "Core language required for Java development.",
        topics: [
            "Java fundamentals",
            "Collections Framework",
            "Exception Handling",
            "Streams and Lambda",
            "Multithreading"
        ]
    },

    "OOP": {
        priority: "High",
        reason: "Fundamental concept for software engineering interviews.",
        topics: [
            "Inheritance",
            "Polymorphism",
            "Abstraction",
            "Encapsulation",
            "Interfaces"
        ]
    },

    "DSA": {
        priority: "High",
        reason: "Frequently tested in technical interviews.",
        topics: [
            "Arrays",
            "Strings",
            "Linked Lists",
            "Stacks and Queues",
            "Trees",
            "Graphs",
            "Dynamic Programming"
        ]
    },

    "SQL": {
        priority: "High",
        reason: "Important for backend development and database interviews.",
        topics: [
            "SELECT queries",
            "WHERE and GROUP BY",
            "JOINs",
            "Subqueries",
            "Indexes",
            "Transactions"
        ]
    },

    "Spring Boot": {
        priority: "High",
        reason: "Widely used for Java backend development.",
        topics: [
            "Spring Boot fundamentals",
            "REST APIs",
            "Dependency Injection",
            "Spring Data JPA",
            "Exception Handling",
            "Authentication"
        ]
    },

    "REST API": {
        priority: "High",
        reason: "Essential for modern backend and full-stack applications.",
        topics: [
            "HTTP methods",
            "Status codes",
            "Request and response handling",
            "REST architecture",
            "Authentication",
            "API security"
        ]
    },

    "DBMS": {
        priority: "High",
        reason: "Important for database and software engineering interviews.",
        topics: [
            "Normalization",
            "Keys",
            "Transactions",
            "ACID properties",
            "Indexes",
            "Joins"
        ]
    },

    "Operating Systems": {
        priority: "Medium",
        reason: "Common computer science interview topic.",
        topics: [
            "Processes",
            "Threads",
            "CPU Scheduling",
            "Deadlocks",
            "Memory Management",
            "Virtual Memory"
        ]
    },

    "Computer Networks": {
        priority: "Medium",
        reason: "Frequently asked in software engineering interviews.",
        topics: [
            "OSI Model",
            "TCP/IP",
            "HTTP/HTTPS",
            "DNS",
            "TCP vs UDP",
            "Network security"
        ]
    },

    "Git": {
        priority: "Medium",
        reason: "Essential for collaborative software development.",
        topics: [
            "git init",
            "git add and commit",
            "Branches",
            "Merge and rebase",
            "Pull requests",
            "Conflict resolution"
        ]
    },

    "MySQL": {
        priority: "Medium",
        reason: "Popular relational database used in backend applications.",
        topics: [
            "Database design",
            "Queries",
            "Joins",
            "Indexes",
            "Transactions"
        ]
    },

    "PostgreSQL": {
        priority: "Medium",
        reason: "Widely used production relational database.",
        topics: [
            "SQL queries",
            "Indexes",
            "Constraints",
            "Transactions",
            "Database design"
        ]
    },

    "GitHub": {
        priority: "Low",
        reason: "Useful for showcasing projects and collaborating with teams.",
        topics: [
            "Repositories",
            "Branches",
            "Pull Requests",
            "Issues",
            "README documentation"
        ]
    }
};


const generateRecommendations = (skillGap) => {

    const recommendations = [];

    const missingRequired =
        skillGap.requiredSkills.missing;

    const missingPreferred =
        skillGap.preferredSkills.missing;

    // Required skills get higher priority
    for (const skill of missingRequired) {

        const information =
            SKILL_PRIORITIES[skill];

        if (!information) {
            continue;
        }

        recommendations.push({
            skill,
            priority: information.priority,
            type: "Required",
            reason: information.reason,
            topics: information.topics
        });
    }

    // Preferred skills
    for (const skill of missingPreferred) {

        const information =
            SKILL_PRIORITIES[skill];

        if (!information) {
            continue;
        }

        recommendations.push({
            skill,
            priority: information.priority,
            type: "Preferred",
            reason: information.reason,
            topics: information.topics
        });
    }

    const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3
    };

    recommendations.sort(
        (a, b) =>
            priorityOrder[a.priority] -
            priorityOrder[b.priority]
    );

    return recommendations;
};


module.exports = {
    generateRecommendations
};