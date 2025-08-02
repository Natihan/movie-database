import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        await fetchAndSetUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAndSetUser = async (authUser) => {
    try {
      const userDoc = await getDoc(doc(db, "users", authUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      setUser({
        uid: authUser.uid,
        email: authUser.email,
        username: userData.username || "",
        photoURL: authUser.photoURL || null,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    }
  };

  const reloadUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      await fetchAndSetUser(auth.currentUser);
    }
  };

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const updateProfilePicture = async (newPhotoURL) => {
    try {
      if (auth.currentUser) {
        // Update Firebase Auth
        await updateProfile(auth.currentUser, {
          photoURL: newPhotoURL,
        });

        // Optionally, update Firestore as well
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          photoURL: newPhotoURL,
        });

        // Refresh user state
        await reloadUser();
      }
    } catch (error) {
      console.error("Failed to update profile picture:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        reloadUser,
        updateProfilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
