import { model } from "../../config/gemini.js";

export async function generateQuiz(
  title,
  description,
  difficulty = "medium",
  numMcqs = 4,
  numWriting = 4,
) {
  const prompt = `
    Generate a quiz with ${numMcqs + numWriting} questions based on:
    Title: ${title}
    Description: ${description}
    Difficulty: ${difficulty}
    - ${numMcqs} multiple-choice questions (MCQs), each with:
      - A clear question
      - 4 answer options (labeled A, B, C, D)
      - The correct answer (specify A, B, C, or D)
    - ${numWriting} paragraph-based writing questions, each with:
      - A clear question requiring a short paragraph response
    Output only a JSON array without explanations, like:
    [
      {
        "type": "mcq",
        "question": "What is 2 + 2?",
        "options": { "A": "3", "B": "4", "C": "5", "D": "6" },
        "correctAnswer": "B"
      },
      {
        "type": "writing",
        "question": "Explain why 2 + 2 equals 4."
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    let response = result.response.text();
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
      return await generateQuiz(title, description, difficulty, numQuestions);
    }
  } catch (error) {
    console.error("Error generating quiz:", error.message);
    throw new Error("Failed to generate quiz: " + error.message);
  }
}

export async function generateMiniQuiz(content, contentType, numQuestions = 4) {
  const numMcqs = Math.ceil(numQuestions / 2); // Half MCQs
  const numWriting = numQuestions - numMcqs; // Half writing

  const prompt = `
    Generate a quiz with ${numQuestions} questions based on:
    ${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content: ${content.link}
    Description: ${content.description}
    - ${numMcqs} multiple-choice questions (MCQs), each with:
      - A clear question related to the content and description
      - 4 answer options (labeled A, B, C, D)
      - The correct answer (specify A, B, C, or D)
    - ${numWriting} paragraph-based writing questions, each with:
      - A clear question requiring a short paragraph response
    Output only a JSON array without explanations, like:
    [
      {
        "type": "mcq",
        "question": "What is the main topic of the ${contentType}?",
        "options": { "A": "Math", "B": "Science", "C": "History", "D": "Art" },
        "correctAnswer": "A"
      },
      {
        "type": "writing",
        "question": "Explain the key concept presented in the ${contentType}."
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    let response = result.response.text();
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
      return await generateMiniQuiz(content, contentType, numQuestions);
    }
  } catch (error) {
    console.error("Error generating mini-quiz:", error.message);
    throw new Error("Failed to generate mini-quiz: " + error.message);
  }
}

export async function gradeWritingResponse(question, studentResponse) {
  const prompt = `
    Grade the following student response to a writing question out of 10 points.
    Question: ${question}
    Student Response: ${studentResponse}
    Provide a score (0-10) and a brief explanation in JSON format, like:
    {
      "score": 8,
      "explanation": "The response is clear and relevant but lacks detail."
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    let response = result.response.text();
    response = response.replace(/json|/g, "").trim();

    const jsonStart = response.indexOf("{");
    const jsonEnd = response.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Malformed JSON: Could not extract valid JSON object.");
    }

    let cleanedJson = response.substring(jsonStart, jsonEnd);
    cleanedJson = cleanedJson.replace(/,\s*}/g, "}");

    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("Error grading writing response:", error.message);
    throw new Error("Failed to grade writing response: " + error.message);
  }
}
