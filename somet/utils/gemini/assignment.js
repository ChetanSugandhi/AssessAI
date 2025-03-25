import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateAssignmentFeedback({ title, description }) {
  try {
    if (!title || !description) {
      throw new Error("Title and description are required");
    }

    const prompt = `
      Generate feedback for the following assignment:

      Title: ${title}
      Description: ${description}

      Provide:
      1. Strengths of the assignment (2-3 sentences).
      2. Areas for improvement (2-3 sentences).
      3. Overall assessment (1-2 sentences, including a grade out of 10).

      Return as a JSON object:
      {
        "strengths": "Strengths text",
        "areasForImprovement": "Areas for improvement text",
        "overallAssessment": "Overall text with grade"
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

export { generateAssignmentFeedback };
