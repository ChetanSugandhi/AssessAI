import React, { useState } from 'react';
import { 
  Trophy, 
  Target, 
  FileText, 
  Star, 
  BookOpen,
  Activity,
  Zap,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';

const StudentDashboard = () => {
  const [studentProfile] = useState({
    name: 'Emma Thompson',
    grade: '11th',
    subjects: [
      {
        name: 'Mathematics',
        currentGrade: 87,
        progressColor: 'bg-cyan-500',
        detailedPerformance: {
          algebraPerformance: 85,
          calculusPerformance: 89,
          trigPerformance: 86
        },
        assignments: [
          { 
            id: 1,
            name: 'Calculus Problem Set', 
            status: 'Completed', 
            score: 92, 
            difficulty: 'High' 
          },
          { 
            id: 2,
            name: 'Algebra Quiz', 
            status: 'Reviewed', 
            score: 85, 
            difficulty: 'Medium' 
          }
        ]
      },
      {
        name: 'Computer Science',
        currentGrade: 79,
        progressColor: 'bg-purple-500',
        detailedPerformance: {
          pythonPerformance: 76,
          algorithmPerformance: 82,
          dataStructuresPerformance: 75
        },
        assignments: [
          { 
            id: 3,
            name: 'Python Programming Project', 
            status: 'In Progress', 
            score: 0, 
            difficulty: 'High' 
          },
          { 
            id: 4,
            name: 'Algorithms Design', 
            status: 'Not Started', 
            score: 0, 
            difficulty: 'Advanced' 
          }
        ]
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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Academic Performance Overview */}
        <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-slate-800 transform transition-all hover:scale-[1.02]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-cyan-400 flex items-center">
              <BookOpen className="mr-3 text-cyan-500" /> Academic Performance
            </h2>
            <span className="bg-slate-800 text-cyan-300 px-4 py-2 rounded-lg">
              {studentProfile.grade} Grade
            </span>
          </div>

          {studentProfile.subjects.map((subject) => (
            <div 
              key={subject.name} 
              className="bg-slate-800 rounded-lg p-4 mb-4 hover:bg-slate-700 transition-colors"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-cyan-300">{subject.name}</h3>
                <span className="text-lg font-bold text-green-400">{subject.currentGrade}%</span>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-3">
                {Object.entries(subject.detailedPerformance).map(([key, value]) => (
                  <div key={key} className="bg-slate-900 p-3 rounded-lg text-center">
                    <span className="text-sm text-slate-400 capitalize">
                      {key.replace('Performance', '')}
                    </span>
                    <p className="text-lg font-bold text-blue-400">{value}%</p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-sm text-slate-300 mb-2">Recent Assignments</h4>
                {subject.assignments.map((assignment) => (
                  <div 
                    key={assignment.id} 
                    className="flex justify-between items-center bg-slate-700 p-2 rounded mb-2"
                  >
                    <div>
                      <span className="text-sm">{assignment.name}</span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full 
                        ${assignment.difficulty === 'High' ? 'bg-red-500 text-white' : 
                          assignment.difficulty === 'Medium' ? 'bg-yellow-500 text-black' : 
                          'bg-green-500 text-white'}`}
                      >
                        {assignment.difficulty}
                      </span>
                    </div>
                    <span className={`
                      ${assignment.score >= 90 ? 'bg-green-500' : 
                        assignment.score >= 80 ? 'bg-blue-500' : 
                        assignment.score === 0 ? 'bg-slate-500' : 'bg-yellow-500'} 
                      text-white px-2 py-1 rounded-full text-xs`}
                    >
                      {assignment.score > 0 ? `${assignment.score}%` : assignment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Learning Goals & Progress */}
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
                    style={{width: `${goal.progress}%`}}
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

        {/* Achievements & Insights */}
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
      </div>
    </div>
  );
};

export default StudentDashboard;