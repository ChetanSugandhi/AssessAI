const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
    required: true
  },
  password: {
    type: String
  },
  joinedClassrooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassroomCreate"  // Changed ref to "ClassroomCreate" to match your schema
    }
  ],
  feedback: [
    {
      teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
      classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "ClassroomCreate" },
      message: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ],
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
