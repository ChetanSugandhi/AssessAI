import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Brain, 
  Calendar, 
  Users, 
  BookOpen,
  AlertCircle,
  Download,
  Upload,
  ExternalLink,
  Award,
  BarChart,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const ClassDetails = () => {
  // Mock data for the selected classroom
  const [classroom] = useState({
    id: 1,
    name: 'Advanced Mathematics',
    teacher: 'Dr. Robert Chen',
    subject: 'Mathematics',
    description: 'An advanced course covering calculus, algebra, and trigonometry for college preparation.',
    color: 'bg-cyan-500',
    students: 28,
    startDate: 'Sep 5, 2024',
    assignments: [
      { 
        id: 1,
        name: 'Calculus Quiz 1', 
        description: 'Covers differentiation and basic integration techniques',
        status: 'Completed', 
        releaseDate: 'Mar 1, 2025',
        submittedOn: 'Mar 3, 2025',
        score: 92,
        feedback: 'Excellent work on integration techniques. Work on showing all steps in differential equations.'
      },
      { 
        id: 2,
        name: 'Algebra Quiz', 
        description: 'Covers matrices, determinants, and linear systems',
        status: 'Completed', 
        releaseDate: 'Mar 5, 2025',
        submittedOn: 'Mar 8, 2025',
        score: 84,
        feedback: null
      },
      { 
        id: 3,
        name: 'Trigonometry Quiz', 
        description: 'Covers unit circle, identities, and inverse functions',
        status: 'Not Started', 
        releaseDate: 'Mar 10, 2025',
        submittedOn: null,
        score: null,
        feedback: null
      },
      { 
        id: 4,
        name: 'Applied Calculus Quiz', 
        description: 'Covers real-world applications of differential and integral calculus',
        status: 'Not Started', 
        releaseDate: 'Mar 15, 2025',
        submittedOn: null,
        score: null,
        feedback: null
      }
    ],
    learningAssessment: {
      completed: false,
      lastAssessmentDate: 'Feb 15, 2025',
      strengths: ['Visual learning', 'Problem solving'],
      areasToImprove: ['Time management', 'Test anxiety'],
      recommendedStrategies: [
        'Use visual aids when studying complex concepts',
        'Break down problems into smaller steps',
        'Schedule specific time blocks for practice'
      ]
    }
  });

  const navigate=useNavigate();
  // State to track which tab is active
  const [activeTab, setActiveTab] = useState('assignments');
  const takeQuiz=()=>{navigate('/quizform');}
  const goBack=()=>{ navigate(-1);}
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button onClick={goBack} className="bg-slate-800 p-2 rounded-full mr-4 hover:bg-slate-700 transition-colors">
          <ArrowLeft />
        </button>
        
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">{classroom.name}</h1>
        </div>
      </div>
      
      {/* Classroom Overview Card */}
      <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-slate-800 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-800 p-4 rounded-lg flex items-center">
            <Calendar className="text-cyan-500 mr-3" />
            <div>
              <p className="text-sm text-slate-400">Start Date</p>
              <p className="font-semibold">{classroom.startDate}</p>
            </div>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg flex items-center">
            <Users className="text-cyan-500 mr-3" />
            <div>
              <p className="text-sm text-slate-400">Teacher</p>
              <p className="font-semibold">{classroom.teacher}</p>
            </div>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg flex items-center">
            <BookOpen className="text-cyan-500 mr-3" />
            <div>
              <p className="text-sm text-slate-400">Subject</p>
              <p className="font-semibold">{classroom.subject}</p>
            </div>
          </div>
        </div>
        
        <p className="text-slate-300">{classroom.description}</p>
      </div>
      
      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'assignments' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-300'}`}
          onClick={() => setActiveTab('assignments')}
        >
          Quizzes
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'learning' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-300'}`}
          onClick={() => setActiveTab('learning')}
        >
          Learning Assessment
        </button>
      </div>
      
      {/* Content based on active tab */}
      <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-slate-800">
        {activeTab === 'assignments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-cyan-400">Quizzes</h2>
              
              <div className="flex space-x-2">
                <span className="flex items-center text-xs bg-slate-800 px-3 py-1 rounded-full">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" /> {classroom.assignments.filter(a => a.status === 'Completed').length} Completed
                </span>
                <span className="flex items-center text-xs bg-slate-800 px-3 py-1 rounded-full">
                  <Clock className="h-3 w-3 text-yellow-500 mr-1" /> {classroom.assignments.filter(a => a.status === 'In Progress' || a.status === 'Pending Review').length} Pending
                </span>
                <span className="flex items-center text-xs bg-slate-800 px-3 py-1 rounded-full">
                  <AlertCircle className="h-3 w-3 text-red-500 mr-1" /> {classroom.assignments.filter(a => a.status === 'Not Started').length} Not Started
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {classroom.assignments.map((assignment) => (
                <div key={assignment.id} className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-cyan-300">{assignment.name}</h3>
                      <p className="text-sm text-slate-400">{assignment.description}</p>
                    </div>
                    <span className={`
                      ${assignment.status === 'Completed' ? 'bg-green-500' : 
                        'bg-red-500'} 
                      text-white px-3 py-1 rounded-full text-xs`}
                    >
                      {assignment.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4 text-sm">
                    <div className="bg-slate-700 p-2 rounded flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-cyan-400" />
                      <div>
                        <span className="text-xs text-slate-400">Released</span>
                        <p>{assignment.releaseDate}</p>
                      </div>
                    </div>
                    
                    {assignment.submittedOn && (
                      <div className="bg-slate-700 p-2 rounded flex items-center">
                        <Upload className="h-4 w-4 mr-2 text-green-400" />
                        <div>
                          <span className="text-xs text-slate-400">Attempted</span>
                          <p>{assignment.submittedOn}</p>
                        </div>
                      </div>
                    )}
                    
                    {assignment.score !== null && (
                      <div className="bg-slate-700 p-2 rounded flex items-center">
                        <Award className="h-4 w-4 mr-2 text-yellow-400" />
                        <div>
                          <span className="text-xs text-slate-400">Score</span>
                          <p>{assignment.score}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {assignment.feedback && (
                    <div className="mt-4 bg-slate-700 p-3 rounded-lg border-l-4 border-cyan-500">
                      <h4 className="text-sm font-semibold text-cyan-300 mb-1">Feedback</h4>
                      <p className="text-sm">{assignment.feedback}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-end space-x-2">
                    {assignment.status === 'Not Started' || assignment.status === 'In Progress' ? (
                      <button onClick={takeQuiz} className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors">
                        <Upload className="mr-2 h-4 w-4" /> Take Quiz
                      </button>
                    ) : (
                      <>
                        <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors">
                          <Eye className="mr-2 h-4 w-4" /> View Solution
                        </button>
                        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors">
                          <MessageSquare className="mr-2 h-4 w-4" /> View Feedback
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'learning' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-cyan-400">Learning Pattern Assessment</h2>
              
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors">
                <Brain className="mr-2 h-4 w-4" /> {classroom.learningAssessment.completed ? 'Retake Assessment' : 'Take Assessment'}
              </button>
            </div>
            
            {classroom.learningAssessment.completed ? (
              <div className="space-y-6">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="text-md font-semibold text-cyan-300 mb-3">Last Assessment</h3>
                  <p className="text-sm text-slate-400">You completed your learning assessment on {classroom.learningAssessment.lastAssessmentDate}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <h3 className="text-md font-semibold text-green-400 mb-3 flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" /> Your Strengths
                    </h3>
                    <ul className="space-y-2">
                      {classroom.learningAssessment.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <h3 className="text-md font-semibold text-yellow-400 mb-3 flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4" /> Areas to Improve
                    </h3>
                    <ul className="space-y-2">
                      {classroom.learningAssessment.areasToImprove.map((area, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="text-md font-semibold text-cyan-300 mb-3 flex items-center">
                    <BarChart className="mr-2 h-4 w-4" /> Recommended Learning Strategies
                  </h3>
                  <ul className="space-y-2">
                    {classroom.learningAssessment.recommendedStrategies.map((strategy, index) => (
                      <li key={index} className="flex items-start text-sm mb-2">
                        <div className="h-5 w-5 bg-cyan-900 rounded-full flex items-center justify-center text-cyan-400 mr-2 mt-0.5">
                          {index + 1}
                        </div>
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-end">
                  <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors">
                    <ExternalLink className="mr-2 h-4 w-4" /> View Full Assessment
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 p-8 rounded-lg text-center">
                <Brain className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Discover Your Learning Style</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                  Take a short assessment to identify your learning strengths and receive personalized strategies to improve your performance in this class.
                </p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-md flex items-center mx-auto transition-colors">
                  <Brain className="mr-2" /> Start Assessment Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetails;