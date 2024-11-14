import React, { createContext, useContext, useState, useEffect, } from "react";
import { auth } from "../Firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  //to check user have admin previlege
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        setIsAdmin(!!tokenResult.claims.admin); // check if admin claim exists
        setCurrentUser(user);
      } else {
        setIsAdmin(false);
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // to fetch a custom admin token
  const fetchAdminToken = async (uid) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/admin/generate-admin-token/${uid}`
      );
      const data = await response.json();
      return data.token; // return the admin token
    } catch (error) {
      console.error("Error fetching admin token:", error);
    }
  };

  // to sign in with the custom token and retrieve an ID token
  const signInWithCustomTokenAndGetIdToken = async (uid) => {
    try {
      const adminToken = await fetchAdminToken(uid); // fetch the admin token
      if (adminToken) {
        await signInWithCustomToken(auth, adminToken); // sign in with the admin token
        const idToken = await auth.currentUser.getIdToken(); // get ID token for further use
        console.log("ID Token:", idToken);
        return idToken;
      }
    } catch (error) {
      console.error("Error signing in with admin token:", error);
    }
  };

  // save user to MongoDB
  const saveUserToMongoDB = async (uid, username, email) => {
    try {
      const response = await fetch("http://localhost:5001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, username, email }),
      });
      const data = await response.json();
      console.log("User saved to MongoDB:", data);
    } catch (error) {
      console.error("Error saving user to MongoDB:", error);
    }
  };

  // signup function
  const signup = async (email, password, username) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await updateProfile(user, { displayName: username });
    await saveUserToMongoDB(user.uid, username, email);
    return user;
  };

  // login function
  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // logout function
  const logout = () => {
    return signOut(auth);
  };

  // track user state without modifying the user object structure
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null); 
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // context value
  const value = {
    currentUser,
    isAdmin,
    signup,
    login,
    logout,
    signInWithCustomTokenAndGetIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
