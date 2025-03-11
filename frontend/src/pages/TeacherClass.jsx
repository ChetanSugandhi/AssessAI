import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  Brain,
  Calendar,
  BarChart2,
  Clock,
  CheckCircle,
  AlertCircle,
  PieChart,
  Target,
  Award,
  UserPlus,
  FileText,
  Plus,
  ArrowLeft,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherClass = ({ classroom, onBack = () => {} }) => {
  // Dummy data for classroom if classroom prop is not provided or is incomplete
  const classroomData = classroom || {
    name: 'Advanced Chemistry',
    subject: 'Delving into organic compounds and reactions',
    students: 28,
    assignmentsCount: 15,
    learningAssessment: true,
    lastActive: 'Yesterday',
    recentAssignments: [
      { id: 'assign1', title: 'Organic Chemistry Reactions', dueDate: '2025-03-15', status: 'active' },
      { id: 'assign2', title: 'Spectroscopy Analysis', dueDate: '2025-03-22', status: 'upcoming' },
      { id: 'assign3', title: 'Lab Report 3', dueDate: '2025-03-08', status: 'completed' },
    ],
  };

  const {
    name = 'Mathematics',
    subject = 'Master the 12th maths.',
    students = 0,
    assignmentsCount = 0,
    learningAssessment = false,
    lastActive = 'never',
    recentAssignments = []
  } = classroomData;

  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    // dueDate: '', // Removed due date
  });
  const [isAddingAssessmentData, setIsAddingAssessmentData] = useState(false); // State for Learning Assessment Dialog

  // Dummy data for performance metrics
  const performanceMetrics = {
    averageGrade: 82,
    completionRate: 85,
    participationRate: 95,
    topPerformers: 5,
    needsAttention: 2,
    averageAssignmentScore: 78,
    studentFeedbackPositive: 90,
    studentFeedbackNegative: 10,
  };

  // Dummy data for student engagement
  const studentEngagement = {
    daily: 90,
    weekly: 95,
    monthly: 92,
    overall: 88,
    lastWeek: 89,
    thisWeek: 95,
  };

  // Dummy data for assignments tab
  const assignmentsData = [
    { id: 'a1', title: 'Quantum Mechanics Problem Set', description: 'Solve problems from chapters 3 & 4',status: 'active', submissions: 25 },
    { id: 'a2', title: 'Thermodynamics Essay', description: 'Essay on the laws of thermodynamics',  status: 'active', submissions: 10 },
    { id: 'a3', title: 'Electromagnetism Quiz', description: 'Quiz on chapters 5 & 6', status: 'completed', submissions: 28 },
    { id: 'a4', title: 'Optics Lab Report', description: 'Report on the recent optics lab experiment',  status: 'completed', submissions: 28 },
  ];

  // Dummy data for students tab
  const studentsData = [
    { id: 's1', name: 'Alice Wonderland', grade: 92, participation: 95 },
    { id: 's2', name: 'Bob The Builder', grade: 88, participation: 90},
    { id: 's3', name: 'Charlie Chaplin', grade: 78, participation: 85  },
    { id: 's4', name: 'Diana Prince', grade: 95, participation: 98 },
    { id: 's5', name: 'Ethan Hunt', grade: 85, participation: 92 },
    { id: 's6', name: 'Fiona Goode', grade: 80, participation: 88  },
    // ... more students
  ];


  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500/20 text-blue-400';
      case 'upcoming':
        return 'bg-purple-500/20 text-purple-400';
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const navigate = useNavigate();
  const goBack = () => { navigate(-1) };

  const handleAddAssessmentData = () => {
    setIsAddingAssessmentData(true);
    // Implement logic to add learning assessment data here
    console.log('Add Learning Assessment Data');
  };


  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={goBack}
            className="mr-4 p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="text-cyan-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">{name}</h1>
            <p className="text-slate-400">{subject}</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsAddingAssignment(true)}
            className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <Plus className="mr-2" /> New Assignment
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-slate-800">
        {['overview', 'assignments', 'students', 'analytics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 -mb-px ${activeTab === tab
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-300'
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Content based on Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Class Overview */}
          <div className="col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <Users className="text-blue-400" />
                  <span className="text-xs text-slate-400">Students</span>
                </div>
                <p className="text-2xl font-bold">{students}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="text-green-400" />
                  <span className="text-xs text-slate-400">Assignments</span>
                </div>
                <p className="text-2xl font-bold">{assignmentsCount}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <Target className="text-purple-400" />
                  <span className="text-xs text-slate-400">Completion Rate</span>
                </div>
                <p className="text-2xl font-bold">{performanceMetrics.completionRate}%</p>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                <BarChart2 className="mr-2" /> Class Performance
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Average Grade</span>
                    <span className="text-lg font-bold text-green-400">
                      {performanceMetrics.averageGrade}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Participation Rate</span>
                    <span className="text-lg font-bold text-blue-400">
                      {performanceMetrics.participationRate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Top Performers</span>
                    <span className="text-lg font-bold text-purple-400">
                      {performanceMetrics.topPerformers} students
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Avg. Assignment Score</span>
                    <span className="text-lg font-bold text-cyan-400">
                      {performanceMetrics.averageAssignmentScore}%
                    </span>
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">Student Engagement</h3>
                  <div className="space-y-2">
                    {Object.entries(studentEngagement).map(([period, rate]) => (
                      <div key={period} className="flex justify-between items-center">
                        <span className="capitalize text-sm text-slate-400">{period}</span>
                        <div className="flex items-center">
                          <div className="w-32 h-2 bg-slate-700 rounded-full mr-2">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{rate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Assignments */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-cyan-400 flex items-center">
                  <Calendar className="mr-2" /> Recent Assignments
                </h2>
                <button className="text-sm text-cyan-400 hover:text-cyan-300">View All</button>
              </div>
              <div className="space-y-3">
                {recentAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="bg-slate-800 p-4 rounded-lg flex items-center justify-between hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="text-slate-400" />
                      <div>
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-slate-400">Due: {assignment.dueDate}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(assignment.status)}`}>
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Learning Assessment Status */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h2 className="text-xl font-bold text-cyan-400 flex items-center mb-4">
                <Brain className="mr-2" /> Learning Assessment
              </h2>
              <div className={`p-4 rounded-lg flex justify-between items-center ${learningAssessment
                ? 'bg-green-500/10 border border-green-500/20'
                : 'bg-yellow-500/10 border border-yellow-500/20'
                }`}>
                <div className="flex items-center">
                  {learningAssessment ? (
                    <CheckCircle className="text-green-400 mr-3" />
                  ) : (
                    <AlertCircle className="text-yellow-400 mr-3" />
                  )}
                  <div>
                    <p className={`font-medium ${learningAssessment ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                      {learningAssessment ? 'Assessment Available' : 'Assessment Pending'}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      {learningAssessment
                        ? 'Ready to evaluate student progress'
                        : 'Waiting for more student data'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleAddAssessmentData}
                  className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded-lg transition-colors text-sm"
                >
                  Add Data
                </button>
              </div>
            </div>

            {/* Class Activity */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h2 className="text-xl font-bold text-cyan-400 flex items-center mb-4">
                <Clock className="mr-2" /> Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                  <p className="text-slate-300">Last active {lastActive}</p>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                  <p className="text-slate-300">3 new submissions today</p>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                  <p className="text-slate-300">2 assignments due this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Assignments</h2>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="space-y-4">
              {assignmentsData.map(assignment => (
                <div key={assignment.id} className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition-colors flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg text-cyan-300">{assignment.title}</h3>
                    <p className="text-slate-400 text-sm">{assignment.description}</p>
                    <p className="text-slate-400 text-sm">Due Date: {assignment.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(assignment.status)}`}>
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </span>
                    <p className="text-slate-400 text-sm">Submissions: {assignment.submissions}/{students}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Students</h2>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <ul className="divide-y divide-slate-800">
              {studentsData.map(student => (
                <li key={student.id} className="p-4 hover:bg-slate-800 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg text-cyan-300">{student.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-sm">Grade: {student.grade}%</p>
                      <p className="text-slate-400 text-sm">Participation: {student.participation}%</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="col-span-3 space-y-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Analytics</h2>

          {/* Overall Class Performance Analytics */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
              <PieChart className="mr-2" /> Overall Class Performance
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-slate-300 mb-2">Average Grade: <span className="text-cyan-200">{performanceMetrics.averageGrade}%</span></p>
                <p className="text-slate-300 mb-2">Completion Rate: <span className="text-cyan-200">{performanceMetrics.completionRate}%</span></p>
                <p className="text-slate-300 mb-2">Participation Rate: <span className="text-cyan-200">{performanceMetrics.participationRate}%</span></p>
                <p className="text-slate-300 mb-2">Average Assignment Score: <span className="text-cyan-200">{performanceMetrics.averageAssignmentScore}%</span></p>
              </div>
              <div>
                <p className="text-slate-300 mb-2">Top Performers: <span className="text-cyan-200">{performanceMetrics.topPerformers} students</span></p>
                <p className="text-slate-300 mb-2">Needs Attention: <span className="text-cyan-200">{performanceMetrics.needsAttention} students</span></p>
                <p className="text-slate-300 mb-2">Positive Student Feedback: <span className="text-cyan-200">{performanceMetrics.studentFeedbackPositive}%</span></p>
                <p className="text-slate-300 mb-2">Negative Student Feedback: <span className="text-cyan-200">{performanceMetrics.studentFeedbackNegative}%</span></p>
              </div>
            </div>
          </div>

          {/* Student Engagement Analytics */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
              <BarChart2 className="mr-2" /> Student Engagement Trends
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-slate-300 mb-2">Daily Engagement: <span className="text-cyan-200">{studentEngagement.daily}%</span></p>
                <p className="text-slate-300 mb-2">Weekly Engagement: <span className="text-cyan-200">{studentEngagement.weekly}%</span></p>
                <p className="text-slate-300 mb-2">Monthly Engagement: <span className="text-cyan-200">{studentEngagement.monthly}%</span></p>
              </div>
              <div>
                <p className="text-slate-300 mb-2">Overall Engagement: <span className="text-cyan-200">{studentEngagement.overall}%</span></p>
                <p className="text-slate-300 mb-2">Last Week Engagement: <span className="text-cyan-200">{studentEngagement.lastWeek}%</span></p>
                <p className="text-slate-300 mb-2">This Week Engagement: <span className="text-cyan-200">{studentEngagement.thisWeek}%</span></p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Add Assignment Dialog */}
      {isAddingAssignment && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-400">New Assignment</h2>
              <button
                onClick={() => setIsAddingAssignment(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter assignment title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-32"
                  placeholder="Enter assignment description"
                />
              </div>
              {/* Due Date Removed */}
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingAssignment(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-colors"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
       {/* Add Learning Assessment Data Dialog */}
       {isAddingAssessmentData && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-400">Add Learning Assessment Data</h2>
              <button
                onClick={() => setIsAddingAssessmentData(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Assessment Data Input
                </label>
                <textarea
                  placeholder="Enter assessment data here..."
                  className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-32"
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingAssessmentData(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-colors"
                >
                  Add Assessment Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClass;