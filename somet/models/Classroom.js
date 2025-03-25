import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  classroomCode: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  topics: [
    {
      name: { type: String, required: true },
      description: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  overallFeedback: {
    feedback: { type: String },
    summary: { type: String },
    generatedAt: { type: Date, default: Date.now },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Classroom", classroomSchema);
