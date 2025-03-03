const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
        
    }, // Student who attempted the test
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassroomCreate",
        required: true

    }, // Classroom associated with the result
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        required: true

    }, // Topic for which the test was taken
    totalQuestions: {
        type: Number,
        required: true

    }, // Total number of questions attempted
    correctAnswers: {
        type: Number,
        required: true

    }, // Number of correct answers
    totalMarks: {
        type: Number,
        required: true

    }, // Total marks available
    obtainedMarks: {
        type: Number,
        required: true

    }, // Marks obtained by the student
    percentage: {
        type: Number,
        required: true

    }, // Performance percentage
    AI_Feedback: {
        type: String

    }, // AI-generated feedback based on performance
    grade: { 
        type: String, 
        required: true 
    }, // Grade (A, B, C, etc.)
    createdAt: {
        type: Date,
        default: Date.now

    }
});

const Result = mongoose.model("Result", ResultSchema);
module.exports = Result;
