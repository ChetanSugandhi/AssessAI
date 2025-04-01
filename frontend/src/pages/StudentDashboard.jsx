import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  Trophy,
  Target,
  FileText,
  Star,
  BookOpen,
  ArrowLeft,
  UserPlus,
  MessageSquare,
  Brain,
  Award,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classroomCode, setClassroomCode] = useState('');

  const [studentProfile] = useState({
    name: 'Emma Thompson',
    grade: '11th',
    learningGoals: [
      {
        id: 1,
        title: 'Master Advanced Calculus',
        progress: 60,
        description: 'Complete advanced integration techniques',
        reward: 'Advanced Mathematician Badge'
      },
      {
        id: 2,
        title: 'ML Project Completion',
        progress: 40,
        description: 'Develop a machine learning application',
        reward: 'Tech Innovator Certificate'
      }
    ],
    achievements: [
      {
        id: 1,
        name: 'Perfect Attendance',
        icon: <Star className="text-yellow-400" />,
        level: 'Gold'
      },
      {
        id: 2,
        name: 'Top Performer',
        icon: <Trophy className="text-purple-500" />,
        level: 'Platinum'
      }
    ]
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:7777/student-dashboard",
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log(response.data);
        if (response.data) {
          // Map the backend data structure to our component's format
          const mappedClassrooms = response.data.classrooms.map((classroom, index) => ({
            id:  index,
            name: classroom.className,
            classcode: classroom.classCode,
            subject: classroom.subject,
            teacher: classroom.teacher.name ,
            color: getRandomClassColor(),
            feedbackAvailable: false, // Placeholder, update with actual backend data if available
            recentAssignments: classroom.assignments.map((topic, topicIndex) => ({
              id: topicIndex + 1,
              name: topic.title,
              description: topic.description,
              status: getTopicStatus(topic),
              createdAt: new Date(topic.createdAt).toLocaleDateString()
            }))
          }));
          console.log(mappedClassrooms)
          setClassrooms(mappedClassrooms);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching classrooms:", err);
        setError("Failed to load classrooms. Please try again later.");
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  // Helper function to determine topic status
  const getTopicStatus = (topic) => {
    // You might want to add more sophisticated status determination logic
    if (topic.completed) return 'Completed';
    if (topic.inProgress) return 'In Progress';
    return 'Not Started';
  };

  // Helper function to get random background color
  const getRandomClassColor = () => {
    const colors = ['bg-cyan-500', 'bg-purple-500', 'bg-orange-500', 'bg-green-500', 'bg-blue-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleClick = () => {
    navigate('/classroom');
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleJoinClassroom = async (e) => {
    e.preventDefault();
    
    const trimmedCode = classroomCode.trim();
    
    if (!trimmedCode) {
      alert("⚠️ Please enter a valid classroom code.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:7777/classroom/join", 
        { classroomCode: trimmedCode }, 
        { 
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("✅ Server Response:", response.data);
      alert(response.data.message); 
      
      // Optionally, refresh classrooms or update UI
      setIsDialogOpen(false);
      setClassroomCode('');
    } catch (error) {
      console.error("❌ Join error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error joining classroom!");
    }
  };

  if (loading) return <div className="text-white p-6">Loading classrooms...</div>;
  if (error) return <div className="text-red-500 p-6">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Join Classroom Dialog - Previously implemented code remains the same */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000]">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
          <div className="relative bg-slate-900 rounded-xl p-6 w-full max-w-md border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-cyan-400">Join Classroom</h3>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleJoinClassroom}>
              <div className="mb-4">
                <label htmlFor="classroomCode" className="block text-sm font-medium text-slate-300 mb-2">
                  Enter Classroom Code
                </label>
                <input
                  type="text"
                  id="classroomCode"
                  value={classroomCode}
                  onChange={(e) => setClassroomCode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter code (e.g., ABC123)"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-colors font-medium"
              >
                Join Classroom
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-slate-800 transform transition-all hover:scale-[1.02]">
          <div className="flex justify-between items-center mb-6">
            <button onClick={goBack} className="bg-slate-800 p-2 rounded-full mr-4 hover:bg-slate-700 transition-colors">
              <ArrowLeft />
            </button>
            <h2 className="text-2xl font-bold text-cyan-400 flex items-center">
              <BookOpen className="mr-3 text-cyan-500" /> My Classrooms
            </h2>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <UserPlus className="mr-2" /> Join Classroom
            </button>
          </div>

          {classrooms.length === 0 ? (
            <div className="text-center text-slate-400 py-10">
              No classrooms joined yet. Click "Join Classroom" to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classrooms.map((classroom) => (
                <div
                  key={classroom.id}
                  className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 cursor-pointer transition-colors"
                  onClick={() =>
                    navigate(`/classroom/${classroom.classcode}`)
                  }
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold text-cyan-300">{classroom.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${classroom.color}`}></div>
                  </div>

                  <p className="text-sm text-slate-400 mb-4">Subject: {classroom.subject}</p>
                  <p className="text-sm text-slate-400 mb-4">Teacher: {classroom.teacher}</p>

                  <div className="mb-4">
                    <h4 className="text-sm text-slate-300 mb-2 flex items-center">
                      <FileText className="mr-1 h-4 w-4" /> Recent Assignments
                    </h4>
                    {classroom.recentAssignments.map((topic) => (
                      <div
                        key={topic.id}
                        className="flex justify-between items-center bg-slate-700 p-2 rounded mb-2"
                      >
                        <div className="overflow-hidden">
                          <span className="text-sm text-white truncate block">{topic.name}</span>
                          <span className="text-xs text-slate-400 truncate block">{topic.description}</span>
                        </div>
                        <span className={`
                          ${topic.status === 'Completed' ? 'bg-green-500' :
                            topic.status === 'In Progress' ? 'bg-blue-500' :
                              'bg-red-500'} 
                          text-white px-2 py-1 rounded-full text-xs`}
                        >
                          {topic.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className={`flex items-center justify-center p-2 rounded-lg ${classroom.feedbackAvailable ? 'bg-green-900 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                      <MessageSquare className="mr-1 h-4 w-4" />
                      <span className="text-xs">Feedback</span>
                    </div>
                    <div className={`flex items-center justify-center p-2 rounded-lg ${classroom.learningAssessmentCompleted ? 'bg-purple-900 text-purple-400' : 'bg-slate-700 text-slate-400'}`}>
                      <Brain className="mr-1 h-4 w-4" />
                      <span className="text-xs">Assessment</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Learning Goals and Achievements sections remain unchanged */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-slate-800 transform transition-all hover:scale-[1.02]">
            <h2 className="text-2xl font-bold text-cyan-400 flex items-center mb-6">
              <Trophy className="mr-3 text-cyan-500" /> Achievements
            </h2>

            <div className="space-y-4">
              {studentProfile.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-slate-800 rounded-lg p-4 flex items-center justify-between hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center">
                    {achievement.icon}
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-cyan-300">{achievement.name}</h3>
                      <span className="text-sm text-slate-400">Level: {achievement.level}</span>
                    </div>
                  </div>
                  <Award className="text-yellow-500" />
                </div>
              ))}
            </div>

            <button className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg transition-colors">
              View All Achievements
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-slate-800 transform transition-all hover:scale-[1.02]">
            <h2 className="text-2xl font-bold text-cyan-400 flex items-center mb-6">
              <Target className="mr-3 text-cyan-500" /> Learning Goals
            </h2>

            <div className="space-y-4">
              {studentProfile.learningGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-cyan-300">{goal.title}</h3>
                    <span className="text-sm text-slate-400">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-cyan-500 h-2.5 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-300">{goal.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-purple-400">Reward: {goal.reward}</span>
                    <button className="text-xs bg-cyan-600 text-white px-3 py-1 rounded-full hover:bg-cyan-700 transition-colors">
                      Update Goal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;