const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    }, // Student who answered
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    }, // Question being answered
    givenAnswer: {
        type: String,
        required: true

    }, 
    createdAt: {
        type: Date,
        default: Date.now

    }
});

const Answer = mongoose.model("Answer", AnswerSchema);
module.exports = Answer;
