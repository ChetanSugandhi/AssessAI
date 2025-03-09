const mongoose = require("mongoose");
const passportlocalmongoose = require("passport-local-mongoose");

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
  username: {
    type: String,
    unique: true,
    required: true // Ensure username is always provided
  },
  joinedClassrooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassroomJoin"
    }
  ], // References classrooms the student has joined
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Enable passport-local-mongoose (default uses `username` field)
StudentSchema.plugin(passportlocalmongoose);

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
