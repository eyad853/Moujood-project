import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { getUser } from "../api/auth";

const UserContext = createContext();

export const AccountProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading , setLoading]=useState(false)
  const [error , setError]=useState('')

  // Fetch user once when app loads
  useEffect(() => {
    getUser(setLoading , setError)
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser , loading , setLoading ,setError ,error}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);