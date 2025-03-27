import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["regular", "quiz"], required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  dueDate: { type: Date },
  quizContent: [
    {
      type: { type: String, enum: ["mcq", "writing"], required: true },
      question: { type: String, required: true },
      options: {
        A: String,
        B: String,
        C: String,
        D: String,
      },
      correctAnswer: { type: String, enum: ["A", "B", "C", "D"] },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Assignment", assignmentSchema);
