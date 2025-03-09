const mongoose = require("mongoose");
const passportlocalmongoose = require("passport-local-mongoose");

const TeacherSchema = new mongoose.Schema({
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
  createdClassrooms: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "ClassroomCreate" 
    }], // References classrooms created by teacher
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

TeacherSchema.plugin(passportlocalmongoose);

const Teacher = mongoose.model("Teacher", TeacherSchema);
module.exports = Teacher;
