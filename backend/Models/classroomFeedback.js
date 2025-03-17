const mongoose = require("mongoose");

const classroomFeedbackSchema = new mongoose.Schema({
    classroomId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "ClassroomCreate", 
        required: true 
    },
    teacherId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Teacher", 
        required: true 
    },
    overallFeedback: { 
        type: String, 
        required: true 
    },  // Teacher's overall feedback for the class
    strengths: { 
        type: String 
    },  // Strengths of the entire classroom
    improvementAreas: { 
        type: String 
    }, 
});

module.exports = mongoose.model("ClassroomFeedback", classroomFeedbackSchema);
