import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignupAs from './pages/SignupAs/SignupAs';
import ClientSignup from './pages/ClientAuth/ClientSignup/ClientSignup';
import ClientLogin from './pages/ClientAuth/ClientLogin/ClientLogin';
import BusinessSignup from './pages/BusinessSignup/BusinessSignup';
import Business_layout from './pages/business_pages/business_layout';
import Business_dashboard from './pages/business_pages/business_dashboard/business_dashboard';
import Business_profile from './pages/business_pages/business_profile/business_profile';
import Business_offers from './pages/business_pages/business_offers/business_offers';

const routes = [
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
  {
    path:'/Business',
    element:<Business_layout />,
    children:[
      {
        path:'dashboard',
        element:<Business_dashboard />
      },
      {
        path:'profile',
        element:<Business_profile />
      },
      {
        path:'offers',
        element:<Business_offers />
      },
    ]
  }
]


const router = createBrowserRouter(routes)


const App = () => {
  return (
      <RouterProvider router={router}/>
  )
}

export default App