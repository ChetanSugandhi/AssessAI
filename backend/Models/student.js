const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  joinedClassrooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassroomJoin"
    }], // References classrooms the student has joined
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
