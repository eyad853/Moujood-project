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
import SA_Layout from './pages/Super_Admin/SA_Layout';

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
    path:'/Business/:id',
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
  },
  {
    path:'/super_admin',
    element:<SA_Layout />,
    children:[
      {
        path:'dashboard',
      },
      {
        path:'users',
      },
      {
        path:'categories',
      },
      {
        path:'notifications',
      },
      {
        path:'posts',
      },
      {
        path:'businesses',
      },
    ]
  },
  {
    path:'/client/:id',
    element:<Business_layout />,
    children:[
      {
        path:'feed',
        element:<Business_dashboard />
      },
      {
        path:'categories',
        element:<Business_profile />
      },
      {
        path:'all_categories',
        element:<Business_offers />
      },
      {
        path:'sub_categories',
        element:<Business_offers />
      },
      {
        path:'businesses_of_category',
        element:<Business_offers />
      },
      {
        path:'business_page',
        element:<Business_offers />
      },
      {
        path:'notifications',
        element:<Business_offers />
      },
      {
        path:'profile',
        element:<Business_offers />
      },
      {
        path:'notifications_settings',
        element:<Business_offers />
      },
      {
        path:'language_settings',
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