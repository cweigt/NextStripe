import { auth } from '@/firebase';
import { User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType>({ user: null, setUser: () => {} });

export const useAuth = () => useContext(AuthContext);
//Custom hook to easily access the auth context
//Components can use this instead of useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  //Manages the auth state
  //Takes children as a prop (these are the components that will have access to the auth state)
  //Uses useState to track the current user
  //Uses useEffect to set up a listener for auth changes
  //Provides the user state to all child components

  const [user, setUser] = useState<User | null>(null);

  
  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user?.email);
      setUser(user);
    });

    return () => listener();
  }, []);
  //Listens for changes in Firebase auth state
  //Updates the local state when auth state changes
  //Cleans up the listener when the component unmounts
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
  //Wraps all children with the context provider
  //Makes the user state available to all child components(global)
}; 