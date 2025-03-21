import React, { createContext, useState, useEffect } from "react";
import { auth } from "./firebaseConfig"; // Import Firebase auth

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to store the user
  const [loading, setLoading] = useState(true); // State to track loading state

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User logged in:", user.email); // 로그인 성공 시 로그 출력
      } else {
        console.log("User logged out"); // 로그아웃 시 로그 출력
      }
      setUser(user); // Update the user state
      setLoading(false); // Set loading to false once the user state is determined
    });

    return unsubscribe; // Unsubscribe from the listener when the component unmounts
  }, []);

  // Provide the user and loading state to the app
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
