import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  Users,
  ClipboardList,
  UserPlus,
  MessageCircle,
  BarChart2,
  Award,
  Bell,
  FileText,
  Clock,
  TrendingUp,
  GitPullRequest,
  FileCheck,
  X,
  BookOpen,
  Brain,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClassroom, setNewClassroom] = useState({
    name: '',
    subject: '',
    description: '',
    classroomCode : ''
  });

  const [classrooms, setClassrooms] = useState([
    {
      id: 1,
      name: 'Advanced Mathematics',
      subject: 'Mathematics',
      students: 28,
      assignmentsCount: 15,
      learningAssessment: true,
      recentAssignments: [
        { id: 1, title: 'Calculus Integration',  status: 'pending' },
        { id: 2, title: 'Linear Algebra Quiz',  status: 'pending' },
        { id: 3, title: 'Differential Equations',  status: 'completed' }
      ]
    },
    {
      id: 2,
      name: 'Computer Science Fundamentals',
      subject: 'Computer Science',
      students: 35,
      assignmentsCount: 12,
      learningAssessment: false,
      recentAssignments: [
        { id: 1, title: 'Python Programming',  status: 'pending' },
        { id: 2, title: 'Data Structures',  status: 'completed' },
        { id: 3, title: 'Algorithm Analysis', status: 'completed' }
      ]
    }
  ]);

  const [aiInsights, setAiInsights] = useState({
    totalAssignmentsGraded: 456,
    averageGradingTimeSaved: 75,
    personalizedFeedbackGenerated: 328,
    learningGapIdentified: 42
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'assignment',
      message: 'New assignment submissions for Calculus',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'performance',
      message: 'Student performance insights ready',
      timestamp: '4 hours ago'
    }
  ]);

  const handleCreateClassroom = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post("http://localhost:7777/create", {
            name: newClassroom.name,
            subject: newClassroom.subject,
            classroomCode: newClassroom.classroomCode, // Typo fix: "classsroomCode" → "classroomCode"
            description: newClassroom.description,
          // add user here

        }, { withCredentials: true }); // Ensures cookies/session is sent if using authentication

        if (response.data.message === "Classroom created successfully") {
            const newClass = {
                id: classrooms.length + 1,
                ...newClassroom,
                students: 0,
                assignmentsCount: 0,
                learningAssessment: false,
                lastActive: "Just created",
                recentAssignments: [],
            };

            setClassrooms([...classrooms, newClass]);
            setNewClassroom({ name: "", subject: "", description: "", classroomCode: "" });
            setIsDialogOpen(false);
        } else {
            alert("Error: " + response.data.message);
        }
    } catch (error) {
        alert(error.response?.data?.message || "Error creating classroom!");
    }
};


  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500/20 text-blue-400';
      case 'upcoming':
        return 'bg-purple-500/20 text-purple-400';
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-red-500/20 text-red-400';
    }
  };

    const navigate = useNavigate();
    const handleHome = () => { navigate(-1)}
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Create Classroom Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-cyan-400 mb-6">Create New Classroom</h2>
            <form onSubmit={handleCreateClassroom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Classroom Name
                </label>
                <input
                  type="text"
                  required
                  value={newClassroom.name}
                  onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
                  className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter Classroom Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Classroom Code
                </label>
                <input
                type='text'
                  value={newClassroom.classroomCode}
                  onChange={(e) => setNewClassroom({ ...newClassroom, classroomCode: e.target.value })}
                  className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter Classroom Code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={newClassroom.subject}
                  onChange={(e) => setNewClassroom({ ...newClassroom, subject: e.target.value })}
                  className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter Subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newClassroom.description}
                  onChange={(e) => setNewClassroom({ ...newClassroom, description: e.target.value })}
                  className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-24"
                  placeholder="Enter Classroom Description"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-colors"
              >
                Create Classroom
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area (3 columns) */}
        <div className="lg:col-span-3 space-y-6">
          {/* AI Insights & Analytics */}
          <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-slate-800 transform transition-all hover:scale-[1.02]">
            <h2 className="text-2xl font-bold text-cyan-400 flex items-center mb-6">
            <button onClick={handleHome} className="bg-slate-800 p-2 rounded-full mr-4 hover:bg-slate-700 transition-colors">
              <ArrowLeft />
            </button>
              <BarChart2 className="mr-3 text-cyan-500" /> AI Grading Insights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <FileCheck className="text-green-400" />,
                  title: 'Assignments Graded',
                  value: aiInsights.totalAssignmentsGraded
                },
                {
                  icon: <Clock className="text-blue-400" />,
                  title: 'Grading Time Saved',
                  value: `${aiInsights.averageGradingTimeSaved}%`
                },
                {
                  icon: <GitPullRequest className="text-purple-400" />,
                  title: 'Personalized Feedback',
                  value: aiInsights.personalizedFeedbackGenerated
                },
                {
                  icon: <TrendingUp className="text-orange-400" />,
                  title: 'Learning Gaps Identified',
                  value: aiInsights.learningGapIdentified
                }
              ].map((metric) => (
                <div
                  key={metric.title}
                  className="flex items-center bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="mr-4">{metric.icon}</div>
                  <div>
                    <p className="text-sm text-slate-400">{metric.title}</p>
                    <p className="text-xl font-bold text-white">{metric.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Classroom Management Advanced */}
          <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-slate-800 transform transition-all hover:scale-[1.02]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-400 flex items-center">
                <Users className="mr-3 text-cyan-500" /> Classroom Management
              </h2>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-cyan-300 px-4 py-2 rounded-lg transition-colors"
              >
                <UserPlus className="inline-block mr-2" /> Create Classroom
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classrooms.map((classroom) => (
                <div
                  key={classroom.id}
                  onClick={() => navigate(`/teacher-class`)}
                  className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-cyan-300">{classroom.name}</h3>
                      <p className="text-sm text-slate-400">{classroom.subject}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-900 p-4 rounded-lg flex items-center">
                      <Users className="text-blue-400 mr-3" />
                      <div>
                        <p className="text-sm text-slate-400">Students</p>
                        <p className="text-lg font-bold">{classroom.students}</p>
                      </div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg flex items-center">
                      <BookOpen className="text-green-400 mr-3" />
                      <div>
                        <p className="text-sm text-slate-400">Assignments</p>
                        <p className="text-lg font-bold">{classroom.assignmentsCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900 p-4 rounded-lg mb-4">
                    <div className="flex items-center">
                      <Brain className="text-purple-400 mr-3" />
                      <span className="text-sm">Learning Assessment</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      classroom.learningAssessment
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {classroom.learningAssessment ? 'Available' : 'Not Available'}
                    </span>
                  </div>

                  {/* Recent Assignments Section */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                      <Calendar className="mr-2 h-4 w-4" /> Recent Assignments
                    </h4>
                    <div className="space-y-2">
                      {classroom.recentAssignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="bg-slate-900 p-3 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium">{assignment.title}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(assignment.status)}`}>
                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications Panel (1 column) */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-slate-800 transform transition-all hover:scale-[1.02] sticky top-6">
            <h2 className="text-2xl font-bold text-cyan-400 flex items-center mb-6">
              <Bell className="mr-3 text-cyan-500" /> Notifications
            </h2>

            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition-colors flex items-start"
                >
                  <div className="mr-4">
                    {notification.type === 'assignment' ? (
                      <FileText className="text-blue-400" />
                    ) : (
                      <BarChart2 className="text-green-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white">{notification.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{notification.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg transition-colors">
              View All Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;