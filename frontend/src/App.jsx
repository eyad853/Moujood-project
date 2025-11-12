import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignupAs from './pages/SignupAs/SignupAs';
import ClientSignup from './pages/ClientAuth/ClientSignup/ClientSignup';
import ClientLogin from './pages/ClientAuth/ClientLogin/ClientLogin';
import BusinessSignup from './pages/BusinessAuth/BusinessSignup/BusinessSignup';

const router = createBrowserRouter([
  {
    path:'/',
    element:<SignupAs />
  },
  {
    path:'/client_sign_up',
    element:<ClientSignup />
  },
  {
    path:'/login',
    element:<ClientLogin />
  },
  {
    path:'/Business_sign_up',
    element:<BusinessSignup />
  },
])


const App = () => {
  return (
      <RouterProvider router={router}/>
  )
}

export default App