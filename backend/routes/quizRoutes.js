const express = require("express");
const router = express.Router();
const { generateQuiz } = require("../controllers/gemini/quizGenerator");

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

module.exports = router;
