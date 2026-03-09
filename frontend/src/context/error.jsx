import { createContext, useContext, useState } from "react";

const SmallError = createContext();

export const ErrorProvider = ({ children }) => {
  const [smallError , setSmallError]=useState('')

  return (
    <SmallError.Provider value={{
        smallError,
        setSmallError
    }}>
      {children}
    </SmallError.Provider>
  );
};

export const useError = () => useContext(SmallError);