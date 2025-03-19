import React, { useState, useEffect } from 'react';
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
  MessageCircle,
  UserPlus,
  FileText,
  Plus,
  ArrowLeft,
  X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const TeacherClass = () => {
  const { classcode } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [isAddingAssessmentData, setIsAddingAssessmentData] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:7777/classroom/${classcode}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch classroom data: ${response.status}`);
        }
        const data = await response.json();
        setClassroom(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching classroom data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (classcode) {
      fetchClassroomData();
    }
  }, [classcode]);

  // Refresh data after adding a new assignment/topic
  const refreshClassroomData = async () => {
    try {
      const response = await fetch(`http://localhost:7777/classroom/${classcode}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch classroom data: ${response.status}`);
      }
      const data = await response.json();
      setClassroom(data);
    } catch (err) {
      console.error("Error refreshing classroom data:", err);
    }
  };

  // Dummy performance metrics (would typically come from API)
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

  // Dummy student engagement data (would typically come from API)
  const studentEngagement = {
    daily: 90,
    weekly: 95,
    monthly: 92,
    overall: 88,
    lastWeek: 89,
    thisWeek: 95,
  };

  // Dummy data for assignments tab
  const assignmentsData = classroom?.assignments || [];

  // Dummy data for students tab
  const studentsData = [
    { id: 's1', name: 'Alice Wonderland', grade: 92, participation: 95 },
    { id: 's2', name: 'Bob The Builder', grade: 88, participation: 90},
    { id: 's3', name: 'Charlie Chaplin', grade: 78, participation: 85  },
    { id: 's4', name: 'Diana Prince', grade: 95, participation: 98 },
    { id: 's5', name: 'Ethan Hunt', grade: 85, participation: 92 },
    { id: 's6', name: 'Fiona Goode', grade: 80, participation: 88  },
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
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // Make API call to add a new topic
      const response = await fetch(`http://localhost:7777/classroom/${classcode}/topic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newAssignment.title,
          description: newAssignment.description,
        }),
        withCredentials: 'true', // Important for sending session cookies
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add assignment');
      }
      
      const data = await response.json();
      console.log('Assignment added successfully:', data);
      
      // Reset form and close dialog
      setNewAssignment({ title: '', description: '' });
      setSubmitSuccess(true);
      
      // Refresh classroom data to show the new assignment
      await refreshClassroomData();
      
      // Close the dialog after a short delay to show success message
      setTimeout(() => {
        setIsAddingAssignment(false);
        setSubmitSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Error adding assignment:', err);
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAssessmentData = (e) => {
    e.preventDefault();
    // Would typically send to API
    console.log('Adding assessment data');
    setIsAddingAssessmentData(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-xl text-cyan-400">Loading classroom data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <p className="text-xl text-red-400 mb-4">Error loading classroom data</p>
        <p className="text-slate-400">{error}</p>
        <button 
          onClick={goBack}
          className="mt-4 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { 
    className = 'Untitled Class',
    subject = '',  
    classDescription = '',
    teacherName = '',
    classJoinedDate = '',
    classFeedback = 'No feedback available',
    assignments = []
  } = classroom || {};

  // Format the date for display
  const formattedDate = new Date(classJoinedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const students = 28; // Placeholder - would come from API

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
            <h1 className="text-3xl font-bold text-cyan-400">{className}</h1>
            <p className="text-slate-400">{classDescription}</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Class Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <p className="text-2xl font-bold">{assignments.length}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <Target className="text-purple-400" />
                  <span className="text-xs text-slate-400">Teacher</span>
                </div>
                <p className="text-2xl font-bold">{teacherName}</p>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                <BarChart2 className="mr-2" /> Class Performance
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                <button 
                  onClick={() => setActiveTab('assignments')}
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {assignments.length > 0 ? (
                  assignments.slice(0, 3).map((assignment, index) => (
                    <div
                      key={index}
                      className="bg-slate-800 p-4 rounded-lg flex items-center justify-between hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <FileText className="text-slate-400" />
                        <div>
                          <h3 className="font-medium">{assignment.title || 'Untitled Assignment'}</h3>
                          <p className="text-sm text-slate-400">
                            {assignment.dueDate ? `Due: ${new Date(assignment.dueDate).toLocaleDateString()}` : 'No due date'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(assignment.status || 'active')}`}>
                        {(assignment.status || 'active').charAt(0).toUpperCase() + 
                         (assignment.status || 'active').slice(1)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-slate-400">
                    No assignments yet. Create your first assignment!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Class Info */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h2 className="text-xl font-bold text-cyan-400 flex items-center mb-4">
                <BookOpen className="mr-2" /> Class Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-slate-400 w-32">Subject:</span>
                  <span className="text-white">{subject}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-400 w-32">Created on:</span>
                  <span className="text-white">{formattedDate}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-400 w-32">Teacher:</span>
                  <span className="text-white">{teacherName}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-400 w-32">Class Code:</span>
                  <span className="text-white">{classcode}</span>
                </div>
              </div>
            </div>
            
            {/* Learning Assessment Status */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h2 className="text-xl font-bold text-cyan-400 flex items-center mb-4">
                <Brain className="mr-2" /> Learning Assessment
              </h2>
              <div className="p-4 rounded-lg flex justify-between items-center bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center">
                  <AlertCircle className="text-yellow-400 mr-3" />
                  <div>
                    <p className="font-medium text-yellow-400">Assessment Pending</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Waiting for more student data
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

            {/* Class Feedback */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h2 className="text-xl font-bold text-cyan-400 flex items-center mb-4">
                <MessageCircle className="mr-2" /> Class Feedback
              </h2>
              <div className="p-4 bg-slate-800 rounded-lg">
                <p className="text-slate-300">{classFeedback}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Assignments</h2>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="space-y-4">
              {assignments.length > 0 ? (
                assignments.map((assignment, index) => (
                  <div key={index} className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition-colors flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg text-cyan-300">{assignment.title || 'Untitled Assignment'}</h3>
                      <p className="text-slate-400 text-sm">{assignment.description || 'No description'}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(assignment.status || 'active')}`}>
                        {(assignment.status || 'active').charAt(0).toUpperCase() + 
                         (assignment.status || 'active').slice(1)}
                      </span>
                      <p className="text-slate-400 text-sm">
                        {assignment.submissions ? `Submissions: ${assignment.submissions}/${students}` : 'No submissions yet'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-slate-400">
                  No assignments yet. Create your first assignment!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="space-y-6">
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
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Analytics</h2>

          {/* Overall Class Performance Analytics */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
              <PieChart className="mr-2" /> Overall Class Performance
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <form className="space-y-4" onSubmit={handleSubmitAssignment}>
              {submitSuccess && (
                <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-3 rounded-lg flex items-center">
                  <CheckCircle className="mr-2" size={18} />
                  Assignment created successfully!
                </div>
              )}
              
              {submitError && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg flex items-center">
                  <AlertCircle className="mr-2" size={18} />
                  {submitError}
                </div>
              )}
              
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
                  required
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
                  required
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingAssignment(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Assignment'
                  )}
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
            <form className="space-y-4" onSubmit={handleSubmitAssessmentData}>
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