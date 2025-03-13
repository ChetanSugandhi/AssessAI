
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
// import Signup from '../components/Signup'
// // import SignUp from '@/pages/SignUp'
// import Login from '../components/Login'
import AuthForm from '../pages/AuthForm'
import StudentDashboard from '../pages/StudentDashboard'
import TeacherDashboard from '../pages/TeacherDashboard'
import ClassroomDetailPage from '../pages/ClassDetails'
import ClassDetails from '../pages/ClassDetails'
import QuizForm from '../pages/QuizForm'
import TeacherClass from '../pages/TeacherClass'
import TeacherLogin from '../pages/TeacherLogin'
import QuizSolution from '../pages/QuizSolution'
import Features from '../pages/Features'
import About from '../pages/About'
// import About from '@/pages/About'
// import Contact from '@/pages/Contact'
const router = createBrowserRouter([
    {
        path: "/",
        element :<App/>,
        children :[
            {
              path:"/",
              element: <Home/>  
         },
    //      {
    //         path:"/about",
    //         element: <About/>  
    //    },
    //    {
    //      path:"/contact",
    //      element: <Contact/>  
    // },
        //  {
        //     path:"/signup",
        //     element:<Signup/>  
        //  },
        //  {
        //     path:"/login",
        //     element:<Login/>  
        //  },
         {
            path:"/student-dashboard",
            element:<StudentDashboard/>
         },
         {
            path:"/teacher-dashboard",
            element:<TeacherDashboard/>
         },
         {
            path:"/authform",
            element:<AuthForm/>
         },
         {
            path:"/classroom",
            element:<ClassDetails/>
         },
         {
            path:"/quizform",
            element:<QuizForm/>
         },
         {
            path:"teacher-class",
            element:<TeacherClass/>
         },
         {
            path:"/teacher-login",
            element:<TeacherLogin/>
         },
         {
            path:"/quiz-solution",
            element:<QuizSolution/>
         },
         {
            path:"/features",
            element:<Features/>
         },
         {
            path:"/about",
            element:<About/>
         }
        ]
    }
])

export default router