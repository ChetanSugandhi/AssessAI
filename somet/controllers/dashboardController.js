import Classroom from "../models/Classroom.js";
import Assignment from "../models/Assignment.js";
import LearningAssessment from "../models/Assessment.js";
import Student from "../models/Student.js";

export const getTeacherDashboard = async (req, res) => {
  const teacherId = req.user._id;

  try {
    const classrooms = await Classroom.find({ teacher: teacherId }).populate(
      "students",
      "_id",
    );
    const classroomIds = classrooms.map((c) => c._id);
    const assignments = await Assignment.find({
      classroom: { $in: classroomIds },
    });
    const assessments = await LearningAssessment.find({
      classroom: { $in: classroomIds },
    });

    const formattedData = classrooms.map((classroom) => ({
      className: classroom.name,
      subject: classroom.subject,
      classCode: classroom.classroomCode,
      studentCount: classroom.students.length,
      topicCount: classroom.topics.length,
      learningAssessmentStatus: assessments.some(
        (a) => a.classroom.toString() === classroom._id.toString(),
      )
        ? "Available"
        : "Not Available",
      recentTopics: classroom.topics
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 3)
        .map((topic) => ({
          title: topic.name,
          description: topic.description,
          createdAt: topic.createdAt,
        })),
      assignments: assignments
        .filter((a) => a.classroom.toString() === classroom._id.toString())
        .map((a) => ({
          id: a._id,
          title: a.title,
          type: a.type,
          dueDate: a.dueDate,
        })),
      assessments: assessments
        .filter((a) => a.classroom.toString() === classroom._id.toString())
        .map((a) => ({ id: a._id, title: a.title })),
      overallFeedback: classroom.overallFeedback || {
        feedback: "Not generated",
        summary: "N/A",
      },
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentDashboard = async (req, res) => {
  const studentId = req.user._id;

  try {
    const classrooms = await Classroom.find({ students: studentId }).populate(
      "teacher",
      "name email",
    );
    const classroomIds = classrooms.map((c) => c._id);
    const assignments = await Assignment.find({
      classroom: { $in: classroomIds },
    }).select("-quizContent.correctAnswer");
    const assessments = await LearningAssessment.find({
      classroom: { $in: classroomIds },
    }).select("-quiz.correctAnswer");
    const student = await Student.findById(studentId).select(
      "assessmentAttempts feedback",
    );

    const formattedData = classrooms.map((classroom) => ({
      className: classroom.name,
      subject: classroom.subject,
      classCode: classroom.classroomCode,
      description: classroom.description,
      teacher: { name: classroom.teacher.name, email: classroom.teacher.email },
      topics: classroom.topics.map((topic) => ({
        title: topic.name,
        description: topic.description,
        createdAt: topic.createdAt,
      })),
      assignments: assignments
        .filter((a) => a.classroom.toString() === classroom._id.toString())
        .map((a) => ({
          id: a._id,
          title: a.title,
          type: a.type,
          dueDate: a.dueDate,
        })),
      assessments: assessments
        .filter((a) => a.classroom.toString() === classroom._id.toString())
        .map((a) => ({
          id: a._id,
          title: a.title,
          attempted: student.assessmentAttempts.some(
            (att) => att.assessmentId.toString() === a._id.toString(),
          ),
        })),
    }));

    res.json({
      classrooms: formattedData,
      feedback: student.feedback || {
        detailed: "No feedback yet",
        summary: "N/A",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
