
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Signup from '../components/Signup'
// import SignUp from '@/pages/SignUp'
import Login from '../components/Login'
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
         {
            path:"/signup",
            element:<Signup/>  
         },
         {
            path:"/login",
            element:<Login/>  
         },
        ]
    }
])

export default router