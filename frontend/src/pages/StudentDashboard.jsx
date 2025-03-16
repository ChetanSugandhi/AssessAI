import React, { useState } from 'react';
import axios from 'axios';

import {
  Trophy,
  Target,
  FileText,
  Star,
  BookOpen,
  ArrowLeft,
  Activity,
  Zap,
  TrendingUp,
  Clock,
  Award,
  UserPlus,
  MessageSquare,
  Brain,
  Book,
  CheckCircle,
  XCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [classroomCode, setClassroomCode] = useState('');
  const [studentProfile] = useState({
    name: 'Emma Thompson',
    grade: '11th',
    classrooms: [
      {
        id: 1,
        name: 'Advanced Mathematics',
        teacher: 'Dr. Robert Chen',
        subject: 'Mathematics',
        color: 'bg-cyan-500',
        recentAssignments: [
          {
            id: 1,
            name: 'Calculus Problem Set',
            status: 'Completed',
            score: 92
          },
          {
            id: 2,
            name: 'Algebra Quiz',
            status: 'Not Started',
            score: null
          }
        ],
        feedbackAvailable: true,
        learningAssessmentCompleted: true
      },
      {
        id: 2,
        name: 'Programming Fundamentals',
        teacher: 'Prof. Lisa Kumar',
        subject: 'Computer Science',
        color: 'bg-purple-500',
        recentAssignments: [
          {
            id: 3,
            name: 'Python Programming Project',
            status: 'Completed',
            score: null
          },
          {
            id: 4,
            name: 'Algorithms Design',
            status: 'Not Started',
            score: null
          }
        ],
        feedbackAvailable: false,
        learningAssessmentCompleted: false
      },
      {
        id: 3,
        name: 'Physics 101',
        teacher: 'Dr. Sarah Johnson',
        subject: 'Physics',
        color: 'bg-orange-500',
        recentAssignments: [
          {
            id: 5,
            name: 'Mechanics Lab Report',
            status: 'Completed',
            score: 88
          }
        ],
        feedbackAvailable: true,
        learningAssessmentCompleted: false
      }
    ],
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

  const handleClick = () => {
    navigate('/classroom');
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleJoinClassroom = async () => {
    console.log("🔍 Debug: Function called!"); // Ensure function triggers

    const classroomCode = document.getElementById("classroomCode")?.value.trim();
    console.log("📩 Classroom code:", classroomCode); // Debug input value

    if (!classroomCode) {
        alert("⚠️ Please enter a valid classroom code.");
        console.log("❌ Classroom code is empty");
        return;
    }

    try {
        const response = await axios.post("http://localhost:7777/join", 
        { classroomCode }, 
        { withCredentials: true });

        console.log("✅ Server Response:", response.data);
        alert(response.data.message); 
    } catch (error) {
        console.error("❌ Join error:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Error joining classroom!");
    }
};



  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
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
            <form onSubmit={(e) => { 
    e.preventDefault(); 
    console.log("📩 Form submitted!"); // Debug log
    handleJoinClassroom(); 
}}>
            <div class="mb-4">
                <label for="classroomCode" class="block text-sm font-medium text-slate-300 mb-2">
                  Enter Classroom Code
                </label>
                <input
                  type="text"
                  id="classroomCode"
                  class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter code (e.g., ABC123)"
                  required
                />
              </div>
              <button
                type="submit"
                class="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-colors font-medium"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentProfile.classrooms.map((classroom) => (
              <div
                key={classroom.id}
                className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 cursor-pointer transition-colors"
                onClick={handleClick}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-cyan-300">{classroom.name}</h3>
                  <div className={`w-3 h-3 rounded-full ${classroom.color}`}></div>
                </div>

                <p className="text-sm text-slate-400 mb-4">Teacher: {classroom.teacher}</p>

                <div className="mb-4">
                  <h4 className="text-sm text-slate-300 mb-2 flex items-center">
                    <FileText className="mr-1 h-4 w-4" /> Recent Assignments
                  </h4>
                  {classroom.recentAssignments.slice(0, 2).map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex justify-between items-center bg-slate-700 p-2 rounded mb-2"
                    >
                      <div className="overflow-hidden">
                        <span className="text-sm text-white truncate block">{assignment.name}</span>
                      </div>
                      <span className={`
                        ${assignment.status === 'Completed' ? 'bg-green-500' :
                          assignment.status === 'In Progress' ? 'bg-blue-500' :
                            assignment.status === 'Pending Review' ? 'bg-yellow-500' :
                              'bg-red-500'} 
                        text-white px-2 py-1 rounded-full text-xs`}
                      >
                        {assignment.status}
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
        </div>

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