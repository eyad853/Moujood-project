import { App as CapApp } from '@capacitor/app';
import { PushNotifications } from '@capacitor/push-notifications';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { Preferences } from '@capacitor/preferences';
import { createBrowserRouter, RouterProvider, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
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
import { useUser } from './context/userContext';
import PageError from './components/PageError/PageError';
import Loadiing from './components/Loadiing/Loadiing'
import { Capacitor } from '@capacitor/core';

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
  const {user , authReady , error}=useUser()
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const userRef = useRef(user);
  const authReadyRef = useRef(authReady);

  const prevPathRef = useRef(null);
  const currentPathRef = useRef(window.location.pathname);

    const blockedBackPages = [
      "/signup_as",
      "/super_admin_login",
      "/verify_email",
      "/forgot-password",
      "/",
      "/client_sign_up",
      "/business_sign_up",
      "/login",
    ];
  
    const inApp = (path) => path.startsWith("/client/") || path.startsWith("/business/");

    const handleBackButton = async () => {
      const currentPath = currentPathRef.current;
      const prevPath = prevPathRef.current;

      // Case 1: currently on a blocked page → minimize
      if (blockedBackPages.includes(currentPath)) {
        await CapApp.minimizeApp();
        return;
      }
    
      // Case 2: in app pages
      if (inApp(currentPath)) {
        if (!prevPath || blockedBackPages.includes(prevPath)) {
          await CapApp.minimizeApp();
          return;
        }
        router.navigate(-1);
        return;
      }
    
      // Case 3: no history → minimize
      if (!prevPath) {
        await CapApp.minimizeApp();
        return;
      }
    
      router.navigate(-1);
    };

  // Add this effect to track path changes (inside App component, alongside other useEffects)
useEffect(() => {
  const unsubscribe = router.subscribe((state) => {
    const newPath = state.location.pathname;
    
    // ignore same-page navigations
    if (newPath === currentPathRef.current) return;

    console.log("Route changed | prev:", currentPathRef.current, "→ new:", newPath);
    prevPathRef.current = currentPathRef.current;
    currentPathRef.current = newPath;
  });
  return () => unsubscribe();
}, []);
  

  useEffect(() => {
    userRef.current = user;
    authReadyRef.current = authReady;
  }, [user, authReady]);

  useEffect(()=>{
    let registrationListener, errorListener , backHandler, urlHandler , actionListener;
  
    const init =async ()=>{
      if(Capacitor.getPlatform()==='android'){
        await SocialLogin.initialize({
          google: {
            clientId:import.meta.env.VITE_GOOGLE_ANDROID_CLIENT_ID,
            webClientId: import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID,
            scopes: ["email", "profile"],
          },
          facebook: {
            appId: import.meta.env.VITE_FACEBOOK_CLIENT_ID,
            clientToken: import.meta.env.VITE_FACEBOOK_CLIENT_TOKEN ,
            scopes: ["email", "public_profile"],
          }
        });
      
        let result = await PushNotifications.checkPermissions();
        if (result.receive === "granted") {
          await PushNotifications.register();
        
        }else{
          // Push notification permissions
          result = await PushNotifications.requestPermissions();
          if (result.receive === 'granted') {
            await PushNotifications.register();
          }
        
        }
      
        // Push notification listeners
         registrationListener =await  PushNotifications.addListener('registration', async (token) => {
            await Preferences.set({ key: "pushToken", value: token.value });
        });
      
         errorListener =await PushNotifications.addListener('registrationError', (error) => {
          console.log(error)
        });

          actionListener = await PushNotifications.addListener(
            'pushNotificationActionPerformed',
            async (action) => {
              const data = action.notification.data;
            
              try {
                const waitForAppReady = () =>
                  new Promise((resolve) => {
                    const check = () => {
                      if (authReadyRef.current) return resolve(true);
                      setTimeout(check, 50);
                    };
                    check();
                  });
                
                await waitForAppReady();
                
                const currentUser = userRef.current;
                
                let targetRoute = null;
                
                if (!currentUser) {
                  targetRoute = '/';
                } else if (currentUser.accountType === 'business') {
                  targetRoute = `/business/notifications?notification_id=${data.notification_id}`;
                } else {
                  targetRoute = `/client/notifications?notification_id=${data.notification_id}`;
                }
              
                router.navigate(targetRoute);
              
              } catch (error) {
                console.log("Notification error:", error);
              
              }
            }
          );

          backHandler = await CapApp.addListener("backButton", handleBackButton);
    
          urlHandler = await CapApp.addListener('appUrlOpen', (event) => {
            try {
              const url = new URL(event.url);
            
              let path;
            
              if (url.protocol === 'http:' || url.protocol === 'https:') {
                path = url.pathname;
              } else {
                path = url.host ? `/${url.host}` : url.pathname;
              }
            
              router.navigate(path + url.search);
            } catch (err) {
              console.log("Deep link error:", err);
            }
          });

          // Check for updates
        const updateResult = await checkForAppUpdate();
        if (updateResult.update) setShowUpdateModal(true);
      }
    }

    init()
  
    return ()=>{
      registrationListener?.remove();
      errorListener?.remove();
      backHandler?.remove();
      urlHandler?.remove();
      actionListener?.remove();
    }
  },[])

  if(error){
    return (
    <div className="fixed inset-0 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      <PageError error={error}/>
    </div>)
  }

  if(!authReady){
    return (
    <div className="fixed inset-0 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      <Loadiing/>
    </div>)
  }

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