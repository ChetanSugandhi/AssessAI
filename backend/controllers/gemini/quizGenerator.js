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
    Format the output as a JSON array, like:
    [
      {
        "question": "What is 2 + 2?",
        "options": {"A": "3", "B": "4", "C": "5", "D": "6"},
        "correctAnswer": "B"
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    let response = await result.response.text();

    response = response.replace(/```json|```/g, "").trim();

    return JSON.parse(response);
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz");
  }
}

module.exports = { generateQuiz };
