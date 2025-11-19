import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignupAs from './pages/SignupAs/SignupAs';
import ClientSignup from './pages/ClientAuth/ClientSignup/ClientSignup';
import ClientLogin from './pages/ClientAuth/ClientLogin/ClientLogin';
import BusinessSignup from './pages/BusinessAuth/BusinessSignup/BusinessSignup';
import { App as CapApp } from '@capacitor/app';

const handleBackButton = () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // hi eyad, if you want to minimize instead of exit, you can use this instead of exitApp()
    // App.minimizeApp();
    CapApp.exitApp();
  }
};

CapApp.addListener('backButton', handleBackButton);

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