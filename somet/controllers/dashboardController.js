import Classroom from "../models/Classroom.js";

// Teacher Dashboard: Classrooms created by the teacher
export const getTeacherDashboard = async (req, res) => {
  const teacherId = req.user._id; // From JWT passport auth

  try {
    const classrooms = await Classroom.find({ teacher: teacherId }).populate(
      "students",
      "_id",
    );

    const formattedData = classrooms.map((classroom) => ({
      className: classroom.name,
      subject: classroom.subject,
      classCode: classroom.classroomCode,
      studentCount: classroom.students.length,
      topicCount: classroom.topics.length,
      learningAssessmentStatus: "Not Available", // Placeholder for future logic
      recentTopics: classroom.topics
        .sort((a, b) => b.createdAt - a.createdAt) // Sort by createdAt descending
        .slice(0, 3) // Last 3 topics
        .map((topic) => ({
          title: topic.name,
          description: topic.description,
          createdAt: topic.createdAt,
        })),
    }));

    res.json({ createdClassrooms: formattedData });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Student Dashboard: Classrooms joined by the student
export const getStudentDashboard = async (req, res) => {
  const studentId = req.user._id; // From JWT passport auth

  try {
    const classrooms = await Classroom.find({ students: studentId }).populate(
      "teacher",
      "name email",
    );

    const formattedData = classrooms.map((classroom) => ({
      name: classroom.name,
      subject: classroom.subject,
      description: classroom.description,
      teacher:classroom.teacher.name,
    }));

    res.json({ joinedClassrooms: formattedData });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
