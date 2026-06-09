import { createContext, useContext, useRef, useEffect } from 'react';
import {router} from '../App'

const NavigationContext = createContext(null);

export const NavigationProvider = ({ children }) => {
  const historyStackRef = useRef([window.location.pathname]);

  useEffect(() => {
    const unsubscribe = router.subscribe((state) => {
      const newPath = state.location.pathname;
      const stack = historyStackRef.current;
      const currentPath = stack[stack.length - 1];

      if (newPath === currentPath) return;

      const action = state.historyAction;

      if (action === 'PUSH') {
        stack.push(newPath);
      } else if (action === 'POP') {
        if (stack.length > 1) stack.pop();
      } else if (action === 'REPLACE') {
        stack[stack.length - 1] = newPath;
      }

      console.log("History stack:", [...stack]);
    });
    return () => unsubscribe();
  }, []);

  const clearHistory = () => {
    historyStackRef.current = [];
  };

  return (
    <NavigationContext.Provider value={{ historyStackRef, clearHistory }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);