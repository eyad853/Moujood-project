import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { getUser } from "../api/auth";
import { handleCreateToken } from "../api/auth";
import { useTranslation } from "react-i18next";

const UserContext = createContext();

export const AccountProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading , setLoading]=useState(true)
  const [error , setError]=useState('')
  const [token , setToken]=useState(null)
  const {t} = useTranslation()
  const [authReady, setAuthReady] = useState(false);

  // Fetch user once when app loads
  useEffect(() => {
    const getUserData = async()=>{
      try{
        const hasToken = await getUser(setLoading , setUser , setError , setToken , t)
        if(!hasToken){
          await handleCreateToken();
        }
      }catch(err){
        if (err.response?.data?.message) {
            setError(t(`errors:${err.response.data.message}`))
        } else if (err.message === "Network Error") {
            setError(t("errors:NETWORK_ERROR"))
        } else if (err.message) {
            setError(t(`errors:${err.message}`))
        } else {
            setError(t("errors:SOMETHING_WENT_WRONG"))
        }
      }finally{
        setAuthReady(true)
      }
      
    }
    getUserData()
  }, []);

  

  return (
    <UserContext.Provider value={{ user, setUser , loading , setLoading ,setError ,error , authReady , setAuthReady}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);