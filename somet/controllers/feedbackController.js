import Feedback from "../models/Feedback.js";
import Classroom from "../models/Classroom.js";

export const submitFeedback = async (req, res) => {
  const { studentId, classroomId, topic, content } = req.body;
  const teacherId = req.user._id; // From JWT passport auth

  try {
    // Verify the topic exists in the classroom
    const classroom = await Classroom.findById(classroomId);
    if (!classroom.topics.some((t) => t.name === topic)) {
      return res
        .status(400)
        .json({ message: "Invalid topic for this classroom" });
    }

    const feedback = await Feedback.create({
      student: studentId,
      teacher: teacherId,
      classroom: classroomId,
      topic,
      content,
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentFeedback = async (req, res) => {
  const { studentId } = req.params;

  try {
    const feedback = await Feedback.find({ student: studentId })
      .populate("teacher", "name")
      .populate("classroom", "name subject");
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const generateClassroomSummary = async (req, res) => {
  const { classroomId } = req.params;

  try {
    const feedback = await Feedback.find({ classroom: classroomId });
    const feedbackByTopic = feedback.reduce((acc, f) => {
      acc[f.topic] = acc[f.topic] || [];
      acc[f.topic].push(f.content);
      return acc;
    }, {});

    // Placeholder AI summary per topic
    const summary = Object.entries(feedbackByTopic)
      .map(([topic, contents]) => `${topic}: ${contents.join(" ")}`)
      .join(" | ");

    const classroom = await Classroom.findByIdAndUpdate(
      classroomId,
      {
        "overallFeedback.summary": `AI Summary: ${summary.slice(0, 100)}...`,
        "overallFeedback.generatedAt": new Date(),
      },
      { new: true },
    );

    res.json(classroom.overallFeedback);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
