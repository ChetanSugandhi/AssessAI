// this is by students
// When a student submits an assignment, AI generates feedback → Teacher modifies → Final feedback stored in StudentFeedback.

const mongoose = require("mongoose");

const studentFeedbackSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Student", 
        required: true 
    },
    classroomId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "ClassroomCreate", 
        required: true 
    },
    assignmentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Assignment", 
        required: true 
    },
    teacherId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Teacher", 
        required: true 
    },
    aiFeedback: { 
        type: String 
    }, 
    teacherFeedback: { 
        type: String 
    },  
    finalFeedback: { 
        type: String, 
        required: true 
    }, 
    grade: { 
        type: String, 
        required: true 
    },  
});

module.exports = mongoose.model("StudentFeedback", studentFeedbackSchema);
