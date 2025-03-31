import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema({
  type: { type: String, enum: ["mcq", "writing"], required: true },
  question: { type: String, required: true },
  options: {
    A: String,
    B: String,
    C: String,
    D: String,
  },
  correctAnswer: { type: String, enum: ["A", "B", "C", "D"] },
});

const assessmentSchema = new mongoose.Schema({
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
  },
  title: { type: String, required: true },
  videoContent: {
    link: { type: String, required: true },
    description: { type: String, required: true },
  },
  audioContent: {
    link: { type: String, required: true },
    description: { type: String, required: true },
  },
  textContent: {
    link: { type: String, required: true },
    description: { type: String, required: true },
  },
  videoQuiz: [quizQuestionSchema],
  audioQuiz: [quizQuestionSchema],
  textQuiz: [quizQuestionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Assessment", assessmentSchema);
