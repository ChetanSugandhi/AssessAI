const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

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
    password:{
        type:String,
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

// Hash password before saving
StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password for login
StudentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
