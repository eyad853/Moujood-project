import { App as CapApp } from '@capacitor/app';
import { PushNotifications } from '@capacitor/push-notifications';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { Preferences } from '@capacitor/preferences';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import SignupAs from './pages/SignupAs/SignupAs';
import ClientSignup from './pages/ClientAuth/ClientSignup/ClientSignup';
import ClientLogin from './pages/ClientAuth/ClientLogin/ClientLogin';
import BusinessSignup from './pages/BusinessAuth/BusinessSignup/BusinessSignup';
import Business_layout from './pages/Business_pages/Business_layout';
import Business_dashboard from './pages/Business_pages/Business_dashboard/Business_dashboard';
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
import Settings from './pages/SettingsPage/Settings';
import SA_Offers from './pages/Super_Admin/SA_Offers/SA_Offers';
import Notifications from './pages/Notifications/Notifications';
import C_Camera from './pages/Client_pages/C_Camera/C_Camera';
import { OfferProvider } from './context/offerContext';
import C_Topics from './pages/Client_pages/C_Topics/C_Topics';
import SA_Ads from './pages/Super_Admin/SA_Ads/SA_Ads';
import { MapProvider } from './context/mapContext';
import Profile from './pages/Profile/Profile';
import { NotificationProvider } from './context/notificationContext';
import SuperAdminAuth from './pages/SuperAdmin_Login/SuperAdmin_Login';
import RootRedirect from './utils/RootRedirect';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import { useState } from 'react';
import { checkForAppUpdate } from './utils/check_version';


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
    element:(
      <RootRedirect />
  )
  },
  {
    path:'/signup_as',
    element:(
        <SignupAs />
  )
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
    path:'/super_admin_login',
    element:<SuperAdminAuth />
  },
  {
    path:'/verify_email',
    element:<VerifyEmail />
  },
  {
    path:'/forgot-password',
    element:<ForgotPassword />
  },
  {
    path:'/business_sign_up',
    element:(
      <MapProvider>
        <BusinessSignup />
      </MapProvider>
  )
  },
  {
    path:'/business',
    element:(
        <MapProvider>
          <OfferProvider >
            <Business_layout />
          </OfferProvider>
        </MapProvider>
    ),
    children:[
      {
        path:'dashboard',
        element:<Business_dashboard />
      },
      {
        path:'profile',
        element:<Profile />
      },
      {
        path:'offers',
        element:<Business_offers />
      },
      {
        path:'notifications',
        element:(
          <NotificationProvider >
            <Notifications />
          </NotificationProvider>
      )
      },
      {
        path:'settings',
        element:<Settings />
      },
    ]
  },
  {
    path:'/super_admin',
    element:(
        <NotificationProvider>
          <MapProvider>
            <OfferProvider >
              <SA_Layout />
            </OfferProvider>
          </MapProvider>
        </NotificationProvider>
  ),
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
      {
        path:'ads',
        element:<SA_Ads />
      },
    ]
  },
  {
    path:'/client',
    element:(
        <MapProvider>
          <C_Layout />
        </MapProvider>
  ),
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
        path:'sub_categories/:categoryName/:categoryId',
        element:<C_Sub_Categories />
      },
      {
        path:'businesses_of_category/:mainCategoryId/:subCategoryName/:subCategoryId',
        element:<C_Business_Of_Category />
      },
      {
        path:'business_page/:business_id',
        element:<C_Business_Page />
      },
      {
        path:'notifications',
        element:(
        <NotificationProvider >
          <Notifications />
        </NotificationProvider>
        )
      },
      {
        path:'profile',
        element:<Profile />
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
    const [updateInfo, setUpdateInfo] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);


  useEffect(()=> {
    SocialLogin.initialize({
      google: {
        webClientId: '1052525713737-uvbc9cv2d4ncndl5f198dq2l3qg7qkop.apps.googleusercontent.com',
      }
    })

    PushNotifications.requestPermissions().then((result) => {
    if (result.receive === 'granted') {
      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register();
    } else {
      alert("Push notification permission not granted");
    }
    
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', async (token) => {
      const savedToken = await Preferences.get({ key:"pushToken"});
      if (savedToken.value !== token.value) {
        //TODO: send token to backend
        alert(token.value + deviceId.identifier);
        await Preferences.set({ key: "pushToken", value: token.value});
      }
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    // PushNotifications.addListener('pushNotificationReceived', (notification) => {

    // });

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        router.navigate('/notifications');
      });
    });

    const initApp = async () => {
      console.log('start the update check');
    // ⭐ check update first
    const result = await checkForAppUpdate();

    if (result.update) {
      setUpdateInfo(result);
      setShowUpdateModal(true);
    }
  };

  initApp();
  }, [])

  
  CapApp.addListener("appUrlOpen", (event) => {
      try {
        const path = event.url.split("app")[1]; // "/business/home"
        if (path) {
          router.navigate(path);
        }
      } catch (err) {
        console.log("Deep link error:", err);
      }
  });



  return (
    <>
      <RouterProvider router={router}/>

      {showUpdateModal && (
        <UpdateModal
          ioOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
    </>
  )
}

export default App