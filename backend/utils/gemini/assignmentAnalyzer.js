const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateAssignmentFeedback({
  topic,
  teacherExpectations,
  classStandard,
  answers,
}) {
  try {
    if (!topic || !answers || !Array.isArray(answers) || answers.length === 0) {
      throw new Error(
        "Topic and answers are required, and answers must be a non-empty array",
      );
    }
    if (!classStandard) {
      throw new Error("Class standard is required");
    }

    const answerDetails = answers
      .map((ans, i) => {
        return `
          Question ${i + 1}: "${ans.question}"
          Student Answer: "${ans.studentAnswer}"
        `;
      })
      .join("\n");

    const prompt = `
      Analyze this student's assignment and generate feedback with some edge for a ${classStandard} student.
      Topic: ${topic}
      Teacher Expectations: "${teacherExpectations || "Provide clear, detailed responses"}"
      Answers:
      ${answerDetails}
      Provide:
      1. Individual feedback for each question (1-2 sentences, sharp and actionable) and assign a grade (0-10) based on quality, accuracy, and meeting expectations.
      2. One overall feedback (2-3 sentences, summarizing performance with a punch, including an overall grade out of 10).
      Return as a JSON object:
      {
        "individualFeedback": [
          {"question": "Question text", "feedback": "Feedback text", "grade": number},
          ...
        ],
        "overallFeedback": "Overall text with overall grade"
      }
    `;

    const geminiResult = await model.generateContent(prompt);
    let response = geminiResult.response.text().trim();

    response = response.replace(/```json|```/g, "").trim();
    const jsonStart = response.indexOf("{");
    const jsonEnd = response.lastIndexOf("}") + 1;
    if (jsonStart === -1 || jsonEnd === -1)
      throw new Error("Malformed JSON from Gemini");

    const feedback = JSON.parse(response.substring(jsonStart, jsonEnd));

    return feedback;
  } catch (error) {
    console.error("Error generating assignment feedback:", error.message);
    throw new Error("Failed to generate feedback: " + error.message);
  }
}

module.exports = { generateAssignmentFeedback };
