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

  // Fetch user once when app loads
  useEffect(() => {
    const getUserData = async()=>{
      const hasToken = await getUser(setLoading , setUser , setError , setToken , t)
      if(!hasToken){
        await handleCreateToken();
      }
    }
    getUserData()
  }, []);

  

  return (
    <UserContext.Provider value={{ user, setUser , loading , setLoading ,setError ,error}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);