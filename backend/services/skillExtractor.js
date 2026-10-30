const SKILL_ALIASES = {
    Java: [
        "java"
    ],

    Python: [
        "python"
    ],

    C: [
        "c"
    ],

    "C++": [
        "c++",
        "cpp"
    ],

    JavaScript: [
        "javascript",
        "js"
    ],

    HTML: [
        "html",
        "html5"
    ],

    CSS: [
        "css",
        "css3"
    ],

    React: [
        "react",
        "react.js",
        "reactjs"
    ],

    "Node.js": [
        "node.js",
        "nodejs",
        "node"
    ],

    Express: [
        "express",
        "express.js",
        "expressjs"
    ],

    "Spring Boot": [
        "spring boot",
        "springboot"
    ],

    Django: [
        "django"
    ],

    Flask: [
        "flask"
    ],

    "REST API": [
        "rest api",
        "restful api",
        "restful apis",
        "rest apis",
        "restful"
    ],

    Bootstrap: [
        "bootstrap"
    ],

    Tailwind: [
        "tailwind",
        "tailwind css"
    ],

    NumPy: [
        "numpy"
    ],

    Pandas: [
        "pandas"
    ],

    Matplotlib: [
        "matplotlib"
    ],

    Seaborn: [
        "seaborn"
    ],

    MySQL: [
        "mysql"
    ],

    PostgreSQL: [
        "postgresql",
        "postgres"
    ],

    MongoDB: [
        "mongodb",
        "mongo"
    ],

    Git: [
        "git"
    ],

    GitHub: [
        "github"
    ],

    "CI/CD": [
        "ci/cd",
        "cicd"
    ],

    DSA: [
        "data structures and algorithms",
        "data structure and algorithms",
        "data structures & algorithms",
        "data structure & algorithms",
        "dsa"
    ],

    OOP: [
        "object-oriented programming",
        "object oriented programming",
        "oop"
    ],

    DBMS: [
        "database management system",
        "database management systems",
        "dbms"
    ],

    "Operating Systems": [
        "operating systems",
        "operating system",
        "os"
    ],

    "Computer Networks": [
        "computer networks",
        "computer network"
    ],

    "Compiler Design": [
        "compiler design"
    ],

    TensorFlow: [
        "tensorflow"
    ],

    PyTorch: [
        "pytorch"
    ],

    Streamlit: [
        "streamlit"
    ],

    AWS: [
        "aws",
        "amazon web services"
    ]
};


const normalizeText = (text) => {
    return text
        .toLowerCase()
        .replace(/[|,;:()[\]{}]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};


const extractSkills = (text) => {

    const normalizedText = normalizeText(text);

    const detectedSkills = [];

    for (const [canonicalSkill, aliases] of Object.entries(SKILL_ALIASES)) {

        for (const alias of aliases) {

            const normalizedAlias = normalizeText(alias);

            const pattern = new RegExp(
                `(^|\\s)${normalizedAlias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=\\s|$)`,
                "i"
            );

            if (pattern.test(normalizedText)) {
                detectedSkills.push(canonicalSkill);
                break;
            }
        }
    }

    return [...new Set(detectedSkills)];
};


module.exports = {
    extractSkills,
    SKILL_ALIASES
};