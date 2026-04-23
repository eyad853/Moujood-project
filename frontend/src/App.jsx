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
import UpdateModal from './components/modals/UpdateModal/UpdateModal'
import Client_Terms_And_Conditions from './pages/Terms_&_Conditions/Client_Terms_And_Conditions';
import Business_Terms_And_Conditions from './pages/Terms_&_Conditions/Business_Terms_And_Conditions';
import Client_Privacy_Policy from './pages/Privacy_Policy/Client_Privacy_Policy';
import Business_Privacy_Policy from './pages/Privacy_Policy/Business_Privacy_Policy';


const handleBackButton = () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // hi eyad, if you want to minimize instead of exit, you can use this instead of exitApp()
    // App.minimizeApp();
    CapApp.exitApp();
  }
};

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
    path:"/client_Terms-&-Conditions",
    element:<Client_Terms_And_Conditions />
  },
  {
    path:"/business_Terms-&-Conditions",
    element:<Business_Terms_And_Conditions />
  },
  {
    path:"/client_Privacy_Policy",
    element:<Client_Privacy_Policy />
  },
  {
    path:"/business_Privacy_Policy",
    element:<Business_Privacy_Policy />
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

  if (window.Capacitor && typeof window.Capacitor.triggerEvent === 'function') {
      window.Capacitor.triggerEvent('pause', 'document');
  }

  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
  const init = async () => {
    // Initialize social login
    console.log('SocialLogin:', SocialLogin);
    await SocialLogin.initialize({
      google: {
        clientId:import.meta.env.VITE_GOOGLE_ANDROID_CLIENT_ID,
        webClientId: import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID,
        scopes: ["email", "profile"],
        mode:"system"
      },
      facebook: {
        appId: import.meta.env.VITE_FACEBOOK_CLIENT_ID,
        clientToken: import.meta.env.VITE_FACEBOOK_CLIENT_TOKEN ,
        scopes: ["email", "public_profile"],
      }
    });

    // Push notification permissions
    const result = await PushNotifications.requestPermissions();
    if (result.receive === 'granted') {
      await PushNotifications.register();
    } else {
      alert("Push notification permission not granted");
    }

    // Push notification listeners
    console.log('PushNotifications:', PushNotifications);
    const registrationListener = PushNotifications.addListener('registration', async (token) => {
      const savedToken = await Preferences.get({ key: "pushToken" });
      if (savedToken.value !== token.value) {
        await Preferences.set({ key: "pushToken", value: token.value });
      }
    });

    const errorListener = PushNotifications.addListener('registrationError', (error) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    const actionListener = PushNotifications.addListener('pushNotificationActionPerformed', () => {
      router.navigate('/notifications');
    });

    // Check for updates
    const updateResult = await checkForAppUpdate();
    if (updateResult.update) setShowUpdateModal(true);

    // Back button & URL listeners
    console.log('CapApp:', CapApp);
    const backHandler = CapApp.addListener('backButton', handleBackButton);
    const urlHandler = CapApp.addListener('appUrlOpen', (event) => {
      try {
        const url = new URL(event.url);
        router.navigate(url.pathname + url.search);
      } catch (err) {
        console.log("Deep link error:", err);
      }
    });

    // Cleanup listeners when component unmounts
    return () => {
      registrationListener.remove();
      errorListener.remove();
      actionListener.remove();
      backHandler.remove();
      urlHandler.remove();
    };
  };

  init();
}, []);

  return (
    <>
      <RouterProvider router={router}/>

      {showUpdateModal && (
        <UpdateModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          router={router}
        />
      )}
    </>
  )
}

export default App