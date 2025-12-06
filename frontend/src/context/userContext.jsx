import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const AccountProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch user once when app loads
  useEffect(() => {
    const get = async()=>{
        try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/auth/me`,
          { withCredentials: true }
        );

        setUser(response.data); // user exists
      } catch (error) {
        setUser(null); // no session
      } 
    }

    get()
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);