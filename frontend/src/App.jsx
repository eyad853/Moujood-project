import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import SignupAs from './pages/SignupAs/SignupAs';
import ClientSignup from './pages/ClientAuth/ClientSignup/ClientSignup';
import ClientLogin from './pages/ClientAuth/ClientLogin/ClientLogin';
import BusinessSignup from './pages/BusinessAuth/BusinessSignup/BusinessSignup';
import Business_layout from './pages/Business_pages/Business_layout';
import Business_dashboard from './pages/Business_pages/Business_dashboard/Business_dashboard';
import Business_profile from './pages/Business_pages/Business_profile/Business_profile';
import Business_offers from './pages/Business_pages/Business_offers/Business_offers';
import SA_Layout from './pages/Super_Admin/SA_Layout';
import SA_Dashboard from './pages/Super_Admin/SA_Dashboard/SA_Dashboard';
import SA_Users from './pages/Super_Admin/SA_Users/SA_Users';
import SA_Categories from './pages/Super_Admin/SA_Categories/SA_Categories';
import SA_Notifications from './pages/Super_Admin/SA_Notifications/SA_Notifications';
import SA_Businesses from './pages/Super_Admin/SA_Businesses/SA_Businesses';
import C_Layout from './pages/Client_pages/C_Layout';
import C_Feed from './pages/Client_pages/C_Feed/C_Feed';
import C_Categories from './pages/Client_pages/C_Categories/C_Categories';
import C_ALL_Categories from './pages/Client_pages/C_ALL_Categories/C_ALL_Categories';
import C_Sub_Categories from './pages/Client_pages/C_Sub_Categories/C_Sub_Categories';
import C_Business_Of_Category from './pages/Client_pages/C_Business_Of_Category/C_Business_Of_Category';
import C_Business_Page from './pages/Client_pages/C_Business_Page/C_Business_Page';
import C_Profile from './pages/Client_pages/C_Profile/C_Profile';
import C_Notification_Settings from './pages/Client_pages/C_Notification_Settings/C_Notification_Settings';
import C_Language_Settings from './pages/Client_pages/C_Language_Settings/C_Language_Settings';
import Settings from './pages/SettingsPage/Settings';
import SA_Offers from './pages/Super_Admin/SA_Offers/SA_Offers';
import Notifications from './pages/Notifications/Notifications';
import C_Camera from './pages/Client_pages/C_Camera/C_Camera';
import { OfferProvider } from './context/offerContext';
import C_Topics from './pages/Client_pages/C_Topics/C_Topics';


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
    element:(
      <OfferProvider >
        <Business_layout />
      </OfferProvider>
    ),
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
      {
        path:'notifications',
        element:<Notifications />
      },
      {
        path:'settings',
        element:<Settings />
      },
    ]
  },
  {
    path:'/super_admin',
    element:<SA_Layout />,
    children:[
      {
        path:'dashboard',
        element:<SA_Dashboard />
      },
      {
        path:'users',
        element:<SA_Users />
      },
      {
        path:'categories',
        element:<SA_Categories />
      },
      {
        path:'notifications',
        element:<SA_Notifications />
      },
      {
        path:'offers',
        element:<SA_Offers />
      },
      {
        path:'businesses',
        element:<SA_Businesses />
      },
    ]
  },
  {
    path:'/client',
    element:<C_Layout />,
    children:[
      {
        path:'feed',
        element:<C_Feed />
      },
      {
        path:'categories',
        element:<C_Categories />
      },
      {
        path:'all_categories',
        element:<C_ALL_Categories />
      },
      {
        path:'sub_categories',
        element:<C_Sub_Categories />
      },
      {
        path:'businesses_of_category',
        element:<C_Business_Of_Category />
      },
      {
        path:'business_page',
        element:<C_Business_Page />
      },
      {
        path:'notifications',
        element:<Notifications />
      },
      {
        path:'profile',
        element:<C_Profile />
      },
      {
        path:'notifications_settings',
        element:<C_Notification_Settings />
      },
      {
        path:'language_settings',
        element:<C_Language_Settings />
      },
      {
        path:'scan',
        element:<C_Camera/>
      },
      {
        path:'settings',
        element:<Settings />
      },
    ]
  },
  {
    path:'topics-you-love',
    element:<C_Topics />
  },
]


const router = createBrowserRouter(routes)
const App = () => {
  
CapApp.addListener("appUrlOpen", (event) => {
    try {
      // Example app link: myapp://app/business/home
      // Extract path after "app"
      const path = event.url.split("app")[1]; // "/business/home"
      if (path) {
        router.navigate(path);
      }
    } catch (err) {
      console.log("Deep link error:", err);
    }
  });

  return (
      <RouterProvider router={router}/>
  )
}

export default App