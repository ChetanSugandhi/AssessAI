const express = require("express");
const router = express.Router();
const { generateQuiz } = require("../utils/gemini/quizGenerator");
const {
  generateAssignmentFeedback,
} = require("../utils/gemini/assignmentAnalyzer");

router.post("/generate", async (req, res) => {
  const { topic, difficulty, classStandard, numQuestions } = req.body;

  if (!topic || !numQuestions) {
    return res
      .status(400)
      .json({ error: "Topic and number of questions are required" });
  }

  try {
    const quiz = await generateQuiz(
      topic,
      difficulty,
      classStandard,
      numQuestions,
    );
    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/feedback", async (req, res) => {
  const { topic, teacherExpectations, classStandard, answers } = req.body;

  try {
    const feedback = await generateAssignmentFeedback({
      topic,
      teacherExpectations,
      classStandard,
      answers,
    });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
