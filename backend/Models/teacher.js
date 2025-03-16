const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
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
    password: {
        type:String,
        required:true
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

// Hash password before saving
TeacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password for login
TeacherSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Teacher = mongoose.model("Teacher", TeacherSchema);
module.exports = Teacher;
