import Classroom from "../models/Classroom.js";
import Student from "../models/Student.js";
import Assignment from "../models/Assignment.js";
import { generateClassroomFeedback } from "../utils/gemini/feedback.js";

// Teacher: Create a new classroom
export const createClassroom = async (req, res) => {
  const { name, subject, classroomCode, description, topics } = req.body;
  const teacherId = req.user._id; // From JWT passport auth

  try {
    // Check if classroomCode is unique
    const existingClassroom = await Classroom.findOne({ classroomCode });
    if (existingClassroom) {
      return res.status(400).json({ message: "Classroom code already in use" });
    }

    const classroom = await Classroom.create({
      name,
      subject,
      classroomCode,
      description,
      teacher: teacherId,
      topics: topics || [], // Optional initial topics
      students: [], // Starts empty
    });

    res.status(201).json({
      className: classroom.name,
      subject: classroom.subject,
      classCode: classroom.classroomCode,
      description: classroom.description,
      topicCount: classroom.topics.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Student: Join a classroom by code
export const joinClassroom = async (req, res) => {
  const { classroomCode } = req.body;
  const studentId = req.user._id; // From JWT passport auth

  try {
    // Find the classroom by code
    const classroom = await Classroom.findOne({ classroomCode });
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Check if student is already enrolled
    if (classroom.students.includes(studentId)) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this classroom" });
    }

    // Add student to classroom
    classroom.students.push(studentId);
    await classroom.save();

    // Add classroom to student's classrooms array
    const student = await Student.findById(studentId);
    student.classrooms.push(classroom._id);
    await student.save();

    res.json({
      message: "You are succesfully enrolled.",
      className: classroom.name,
      subject: classroom.subject,
      description: classroom.description,
      teacher: classroom.teacher,
      topics: classroom.topics.map((topic) => ({
        title: topic.name,
        description: topic.description,
        createdAt: topic.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getClassroomDetails = async (req, res) => {
  const { classcode } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  try {
    const classroom = await Classroom.findOne({ classroomCode: classcode })
      .populate("teacher", "name")
      .populate("students", "name _id") // Fetch student names properly
      .populate("overallFeedback", "feedback");

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    const assignments = await Assignment.find({ classroom: classroom._id });

    if (userRole === "teacher") {
      if (classroom.teacher._id.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      return res.json({
        className: classroom.name,
        classJoinedDate: classroom.createdAt,
        teacherName: classroom.teacher.name,
        subject: classroom.subject,
        classDescription: classroom.description,
        students: classroom.students.map((student) => ({
          id: student._id,
          name: student.name, // No need to fetch separately
        })),
        classFeedback: classroom.overallFeedback?.feedback || "No feedback yet",
        assignments: assignments.map((assignment) => ({
          title: assignment.title,
          description: assignment.description,
          creationDate: assignment.createdAt,
        })),
      });
    }

    if (userRole === "student") {
      const student = await Student.findById(userId).populate("assignmentAttempts");

      if (!classroom.students.some((s) => s._id.toString() === userId.toString())) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const formattedAssignments = assignments.map((assignment) => {
        const attempt = student.assignmentAttempts.find(
          (a) => a.assignmentId.toString() === assignment._id.toString()
        );

        return {
          id: assignment._id,
          title: assignment.title,
          description: assignment.description,
          creationDate: assignment.createdAt,
          attemptedDate: attempt?.attemptedDate || null,
          score: attempt?.score || null,
        };
      });

      return res.json({
        className: classroom.name,
        classJoinedDate: classroom.createdAt, // No need to check if joined again
        teacherName: classroom.teacher.name,
        subject: classroom.subject,
        classDescription: classroom.description,
        classFeedback: classroom.overallFeedback?.feedback || "No feedback yet",
        assignments: formattedAssignments,
      });
    }

    return res.status(400).json({ message: "Invalid role" });
  } catch (error) {
    console.error("Error fetching classroom details:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const generateClassFeedback = async (req, res) => {
  const { classcode } = req.params;
  const teacherId = req.user._id;

  try {
    const classroom = await Classroom.findOne({ classroomCode: classcode });
    if (!classroom || classroom.teacher.toString() !== teacherId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized or classroom not found" });
    }

    const students = await Student.find({ classrooms: classroom._id }).select(
      "assignmentAttempts assessmentAttempts",
    );

    const studentPerformances = students.map((student) => ({
      studentId: student._id,
      assignments: student.assignmentAttempts.map((a) => ({
        score: a.score,
        feedbacks: a.responses.map((r) => r.feedback),
      })),
      assessments: student.assessmentAttempts.map((a) => ({
        score: a.score,
        feedbacks: a.responses.map((r) => r.feedback),
      })),
    }));

    const feedbackResult = await generateClassroomFeedback(studentPerformances);

    classroom.overallFeedback = {
      feedback: feedbackResult.feedback,
      summary: feedbackResult.summary,
      generatedAt: new Date(),
    };
    await classroom.save();

    res.json({
      feedback: classroom.overallFeedback.feedback,
      summary: classroom.overallFeedback.summary,
      generatedAt: classroom.overallFeedback.generatedAt,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate classroom feedback: " + error.message,
    });
  }
};

export const removeStudent = async (req, res) => {
  const { studentId } = req.params;
  const classroomId = req.params.classroomId; // Classroom ID from URL
  const teacherId = req.user._id; // From JWT passport auth

  try {
    const classroom = await Classroom.findById(classroomId);
    if (!classroom || classroom.teacher.toString() !== teacherId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    classroom.students = classroom.students.filter(
      (student) => student.toString() !== studentId
    );
    await classroom.save();

    res.json({ message: "Student removed successfully" });
  } catch (error) {
    console.error("Error removing student:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const getAssignment = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const assignment = await Assignment.findById(assignmentId);

    res.json(assignment);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
