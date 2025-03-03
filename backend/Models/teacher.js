const mongoose = require("mongoose");

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
  password: { 
    type: String, 
    required: true 

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

const Teacher = mongoose.model("Teacher", TeacherSchema);
module.exports = Teacher;
