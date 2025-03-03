const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassroomCreate",
        required: true

    }, // Classroom to which the topic belongs
    title: {
        type: String,
        required: true

    }, // Topic name
    description: {
        type: String

    }, // Optional description
    createdAt: {
        type: Date,
        default: Date.now

    }
});

const Topic = mongoose.model("Topic", TopicSchema);
module.exports = Topic;