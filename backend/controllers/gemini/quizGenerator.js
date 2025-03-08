
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateQuiz(
  topic,
  difficulty = "medium",
  classStandard = "8th grade",
  numQuestions = 5,
) {
  const prompt = `
    Generate ${numQuestions} multiple-choice questions (MCQs) for a ${classStandard} student.
    Topic: ${topic}
    Difficulty: ${difficulty}
    Each question should have:
    - A clear question
    - 4 answer options (labeled A, B, C, D)
    - The correct answer (specify which option: A, B, C, or D)
    Output only a JSON array without explanations, like:
    [
      {
        "question": "What is 2 + 2?",
        "options": { "A": "3", "B": "4", "C": "5", "D": "6" },
        "correctAnswer": "B"
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    let response = await result.response.text();

    console.log("Raw AI Response:", response); // Debugging

    response = response.replace(/json|/g, "").trim();

    const jsonStart = response.indexOf("[");
    const jsonEnd = response.lastIndexOf("]") + 1;

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Malformed JSON: Could not extract valid JSON array.");
    }

    let cleanedJson = response.substring(jsonStart, jsonEnd);

    cleanedJson = cleanedJson.replace(/,\s*]/g, "]").replace(/,\s*}/g, "}");

    try {
      return JSON.parse(cleanedJson);
    } catch (jsonError) {
      console.error("Invalid JSON received:", cleanedJson);

      console.log("Retrying with a stricter prompt...");
      return await generateQuiz(topic, difficulty, classStandard, numQuestions);
    }
  } catch (error) {
    console.error("Error generating quiz:", error.message);
    throw new Error("Failed to generate quiz: " + error.message);
  }
}

module.exports = { generateQuiz };
