import React, { useState, useEffect } from 'react';
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
  FileCheck
} from 'lucide-react';

const TeacherDashboard = () => {
  const [classrooms, setClassrooms] = useState([
    {
      id: 1,
      name: 'Advanced Mathematics',
      students: 28,
      performanceMetrics: {
        averageScore: 85.6,
        topicCoverage: 72,
        engagementRate: 88
      },
      recentActivities: [
        { type: 'assignment', title: 'Calculus Problem Set', pending: 12 },
        { type: 'quiz', title: 'Algebra Midterm', pending: 5 }
      ]
    },
    {
      id: 2,
      name: 'Computer Science Fundamentals',
      students: 35,
      performanceMetrics: {
        averageScore: 79.3,
        topicCoverage: 65,
        engagementRate: 82
      },
      recentActivities: [
        { type: 'project', title: 'Python Programming', pending: 15 },
        { type: 'assignment', title: 'Algorithms Design', pending: 8 }
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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Classroom Management Advanced */}
        <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-slate-800 transform transition-all hover:scale-[1.02]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-cyan-400 flex items-center">
              <Users className="mr-3 text-cyan-500" /> Classroom Management
            </h2>
            <button className="bg-slate-800 hover:bg-slate-700 text-cyan-300 px-4 py-2 rounded-lg transition-colors">
              <UserPlus className="inline-block mr-2" /> Create Classroom
            </button>
          </div>

          {classrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="bg-slate-800 rounded-lg p-4 mb-4 hover:bg-slate-700 transition-colors"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-cyan-300">{classroom.name}</h3>
                <span className="text-sm text-slate-400">{classroom.students} Students</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-slate-900 p-3 rounded-lg text-center">
                  <span className="text-sm text-slate-400">Avg. Score</span>
                  <p className="text-lg font-bold text-green-400">{classroom.performanceMetrics.averageScore}%</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg text-center">
                  <span className="text-sm text-slate-400">Topic Coverage</span>
                  <p className="text-lg font-bold text-blue-400">{classroom.performanceMetrics.topicCoverage}%</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg text-center">
                  <span className="text-sm text-slate-400">Engagement</span>
                  <p className="text-lg font-bold text-purple-400">{classroom.performanceMetrics.engagementRate}%</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm text-slate-300 mb-2">Recent Activities</h4>
                {classroom.recentActivities.map((activity) => (
                  <div
                    key={activity.title}
                    className="flex justify-between items-center bg-slate-700 p-2 rounded mb-2"
                  >
                    <span className="text-sm">{activity.title}</span>
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs">
                      {activity.pending} Pending
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Insights & Analytics */}
        <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-slate-800 transform transition-all hover:scale-[1.02]">
          <h2 className="text-2xl font-bold text-cyan-400 flex items-center mb-6">
            <BarChart2 className="mr-3 text-cyan-500" /> AI Grading Insights
          </h2>

          <div className="space-y-6">
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

        {/* Notifications & Communication */}
        <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-slate-800 transform transition-all hover:scale-[1.02]">
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
  );
};

export default TeacherDashboard;