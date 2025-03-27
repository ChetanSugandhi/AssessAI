import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const assignmentAttemptSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
  },
  attemptedDate: { type: Date, default: Date.now },
  responses: [
    {
      questionIndex: { type: Number, required: true },
      answer: { type: String, required: true },
      feedback: { type: String },
    },
  ],
  score: { type: Number },
});

const assessmentAttemptSchema = new mongoose.Schema({
  assessmentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
  },
  attemptedDate: { type: Date, default: Date.now },
  responses: [
    {
      questionIndex: { type: Number, required: true },
      answer: { type: String, required: true },
      feedback: { type: String },
    },
  ],
  score: { type: Number },
});

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  classrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classroom" }],
  assignmentAttempts: [assignmentAttemptSchema],
  assessmentAttempts: [assessmentAttemptSchema],
  feedback: {
    detailed: { type: String },
    summary: { type: String },
    generatedAt: { type: Date },
  },
});

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Student", studentSchema);
