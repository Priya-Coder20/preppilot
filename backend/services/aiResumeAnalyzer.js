const { analyzeResumeText } = require("./resumeAnalyzer");

const analyzeResumeWithAI = async(analyzeResumeText, targetRole) =>{
    const prompt = `
You are an experienced technical recruiter and resume reviewer.

Analyze the following resume for the target role: ${targetRole}.

Rules:
1. Use only information supported by the resume.
2. Never invent skills, experience, projects, achievements, or qualifications.
3. Identify strengths relevant to the target role.
4. Suggest specific, practical improvements.
5. Identify missing information that could improve the resume.
6. Do not claim that a skill is missing if the resume text is unclear.
7. Return valid JSON only, using the exact structure below.

JSON structure:
{
  "summary": "Brief overall resume assessment",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "projectFeedback": ["project-related feedback"],
  "missingInformation": ["information that may be worth adding"],
  "targetRoleFit": "Explanation of how the resume aligns with the target role"
}

RESUME TEXT:
   ${resumeText}
   `;

   console.log("Starting Ollama AI request...");
   
   console.time("Ollama AI request");
   const response = await fetch("http://localhost:11434/api/chat",{
    method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "qwen2.5:3b",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            format: "json",
            stream: false,
            keep_alive: "10m",
            options: {
                temperature: 0.2,
                num_predict:500,
                num_ctx:4096
            }
        })
   });
   console.timeEnd("Ollama AI request");
   console.log("Ollama response received:", response.status);

   if(!response.ok){
    throw new Error(`Ollama request failed: ${response.status}`);

   }
   const data = await response.json();
   const aiResponse = data.message?.content;

   if(!aiResponse){
    throw new Error(`Ollama returned an empty AI response.`);
   }
   try{
    return JSON.parse(aiResponse);
   }catch{
    throw new Error("The AI returned an invalid JSON response.");
   }
};

module.exports ={ analyzeResumeWithAI };