const mongoose = require("mongoose");

const ClassroomCreateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    classroomCode: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true  // ✅ Fixed typo
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
    },
    topics: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic"
        }
    ],
    joinedStudents: [{  // ✅ Added this to track students joining
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    ],
    feedback: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ClassroomCreate = mongoose.model("ClassroomCreate", ClassroomCreateSchema);
module.exports = ClassroomCreate;
