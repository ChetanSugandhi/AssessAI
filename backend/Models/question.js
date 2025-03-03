const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
    }, // Topic associated with question
    questionType: {
        type: String,
        enum: ["MCQ", "Paragraph"],
        required: true
    }, // Type of question
    questionText: {
        type: String,
        required: true

    }, // Question content
    options: [
        {
            type: String
        }
    ],
    correctAnswer: {
        type: String
    }, // Correct answer (MCQ) or model answer (Paragraph)
    createdAt: {
        type: Date,
        default: Date.now

    }
});

const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;