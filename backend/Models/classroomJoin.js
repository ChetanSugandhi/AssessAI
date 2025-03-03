const mongoose = require("mongoose");

const ClassroomJoinSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",

    }, // Student joining
    subject: {
        type: String,
        required: true

    }, // Subject of classroom being joined
    classroomCode: {
        type: String,
        required: true

    }, // Code provided by teacher to join
    joinedAt: {
        type: Date,
        default: Date.now

    }
});

const ClassroomJoin = mongoose.model("ClassroomJoin", ClassroomJoinSchema);
module.exports = ClassroomJoin;
