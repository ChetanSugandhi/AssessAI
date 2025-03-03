const mongoose = require("mongoose");

const ClassroomCreateSchema = new mongoose.Schema({
    name: {     // Classroom name
        type: String,
        required: true
    },      
    subject: {      // Subject name
        type: String,
        required: true

    }, 
    classroomCode: {        // Unique code for students to join
        type: String,
        required: true,
        unique: true

    }, 
    teacherId: {        // Reference to the teacher
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
    }, 
    topics: [       // Topics added to the classroom
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic"

        }
    ], 
    createdAt: {
        type: Date,
        default: Date.now

    }
});

const ClassroomCreate = mongoose.model("ClassroomCreate", ClassroomCreateSchema);
module.exports = ClassroomCreate;