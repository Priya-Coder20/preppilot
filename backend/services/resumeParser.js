const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

const parseResume = async (file) => {
    if (!file) {
        throw new Error("No resume file provided.");
    }

    const fileType = file.mimetype;

    // PDF
    if (fileType === "application/pdf") {

        const parser = new PDFParse({
            data: file.buffer
        });

        try {
            const result = await parser.getText();

            return {
                text: result.text.trim(),
                pages: result.total,
                fileType: "PDF"
            };

        } finally {
            await parser.destroy();
        }
    }

    // DOCX
    if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {

        const result = await mammoth.extractRawText({
            buffer: file.buffer
        });

        return {
            text: result.value.trim(),
            pages: null,
            fileType: "DOCX"
        };
    }

    throw new Error(
        "Unsupported file type. Please upload a PDF or DOCX file."
    );
};

module.exports = parseResume;