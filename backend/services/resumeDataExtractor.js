const extractEmail = (text) => {
    const match = text.match(
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
    );

    return match ? match[0] : null;
};

const extractPhone = (text) => {
    const match = text.match(
        /(?:\+91[\s-]?)?[6-9]\d{9}/
    );

    return match ? match[0] : null;
};

const extractName = (text) => {
    const lines = text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);

    if (lines.length === 0) {
        return null;
    }

    const firstLine = lines[0];

    if (
        !firstLine.includes("@") &&
        !/\d/.test(firstLine) &&
        firstLine.length < 80
    ) {
        return firstLine;
    }

    return null;
};

const extractEducation = (sections) => {
    return sections.education || [];
};

const extractProjects = (sections) => {
    return sections.projects || [];
};

const extractExperience = (sections) => {
    return sections.experience || [];
};

const extractCertifications = (sections) => {
    return sections.certifications || [];
};

const extractResumeData = (text, sections, skills) => {
    return {
        candidate: {
            name: extractName(text),
            email: extractEmail(text),
            phone: extractPhone(text)
        },

        education: extractEducation(sections),

        projects: extractProjects(sections),

        experience: extractExperience(sections),

        certifications: extractCertifications(sections),

        skills
    };
};

module.exports = {
    extractResumeData
};