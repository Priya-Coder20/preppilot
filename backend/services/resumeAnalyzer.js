const SECTION_ALIASES = {
    objective: [
        "career objective",
        "objective",
        "professional summary",
        "summary"
    ],

    education: [
        "education",
        "academic background",
        "academic qualifications"
    ],

    skills: [
        "technical skills",
        "skills",
        "technical expertise",
        "technologies"
    ],

    projects: [
        "projects",
        "academic projects",
        "personal projects"
    ],

    experience: [
        "experience",
        "work experience",
        "professional experience",
        "employment",
        "volunteering / work experience"
    ],

    certifications: [
        "certifications",
        "certificates",
        "achievements",
        "certifications & achievements"
    ],

    volunteering: [
        "volunteering",
        "volunteer experience",
        "community experience"
    ]
};

const normalizeLine = (line) => {
    return line
        .replace(/\s+/g, " ")
        .trim();
};

const findSection = (line) => {
    const normalized = line
        .toLowerCase()
        .replace(/[:]/g, "")
        .trim();

    for (const [section, aliases] of Object.entries(
        SECTION_ALIASES
    )) {
        if (aliases.includes(normalized)) {
            return section;
        }
    }

    return null;
};

const analyzeResumeText = (text) => {
    const lines = text
        .split(/\r?\n/)
        .map(normalizeLine)
        .filter(Boolean);

    const sections = {
        objective: [],
        education: [],
        skills: [],
        projects: [],
        experience: [],
        certifications: [],
        volunteering: [],
        other: []
    };

    let currentSection = "other";

    for (const line of lines) {
        const detectedSection = findSection(line);

        if (detectedSection) {
            currentSection = detectedSection;
            continue;
        }

        if (line.startsWith("--")) {
            continue;
        }

        sections[currentSection].push(line);
    }

    return {
        sections,
        statistics: {
            totalLines: lines.length,
            objectiveLines:
                sections.objective.length,
            educationLines:
                sections.education.length,
            skillLines:
                sections.skills.length,
            projectLines:
                sections.projects.length,
            experienceLines:
                sections.experience.length,
            certificationLines:
                sections.certifications.length,
            volunteeringLines:
                sections.volunteering.length
        }
    };
};

module.exports = {
    analyzeResumeText
};