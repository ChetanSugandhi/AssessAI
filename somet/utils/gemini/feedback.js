import { model } from "../../config/gemini.js";

export async function generateStudentFeedback(
  assignmentFeedbacks,
  assessmentFeedbacks,
) {
  const prompt = `
    Generate a comprehensive feedback summary for a student based on:
    Assignment Feedbacks: ${JSON.stringify(assignmentFeedbacks)}
    Assessment Feedbacks: ${JSON.stringify(assessmentFeedbacks)}
    Assessment feedbacks include responses and scores by content type (video, audio, text).
    Provide a detailed feedback paragraph and a concise summary in JSON format, like:
    {
      "feedback": "The student excels in video quizzes (90%) but struggles with audio (60%). Writing responses need more detail.",
      "summary": "Strong in video, improve audio and writing."
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
    console.error("Error generating student feedback:", error.message);
    throw new Error("Failed to generate student feedback: " + error.message);
  }
}

export async function generateClassroomFeedback(studentPerformances) {
  const prompt = `
    Generate an overall feedback and summary for a classroom based on the following student performances:
    Student Performances: ${JSON.stringify(studentPerformances)}
    Each entry includes assignment and assessment scores and feedbacks.
    Provide a detailed feedback paragraph and a concise summary in JSON format, like:
    {
      "feedback": "The classroom demonstrates a solid understanding of core concepts, with most students excelling in MCQs but needing improvement in writing skills.",
      "summary": "Strong overall performance with a focus needed on writing elaboration."
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
    console.error("Error generating classroom feedback:", error.message);
    throw new Error("Failed to generate classroom feedback: " + error.message);
  }
}
