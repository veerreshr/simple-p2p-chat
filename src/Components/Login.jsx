import React, { useState, useEffect } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import LogoutIcon from "@mui/icons-material/Logout";
import { getDatabase, ref, set } from "firebase/database";
import MenuItem from "@mui/material/MenuItem";

function Login() {
  const signin = useStoreActions((actions) => actions.auth.signin);
  const signout = useStoreActions((actions) => actions.auth.signout);
  const isLoggedIn = useStoreState((state) => state.auth.isLoggedIn);

  const [showLogin, setShowLogin] = useState(false);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const writeUserDetailsToDatabase = (uid, details) => {
    const db = getDatabase();
    set(ref(db, "users/" + uid + "/details"), details);
  };

  const signInHelper = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const extractedUserData = {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        };
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        localStorage.setItem("userInfo", JSON.stringify(extractedUserData));
        signin(extractedUserData);
        writeUserDetailsToDatabase(user.uid, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      })
      .catch((error) => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userInfo");
        toast.error(error.message);
        // const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  const signOutHelper = () => {
    signOut(auth)
      .then(() => {
        localStorage.setItem("isLoggedIn", JSON.stringify(false));
        localStorage.removeItem("userInfo");
        signout();
        toast.success("Logged out");
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };

  useEffect(() => {
    setShowLogin(isLoggedIn);
  }, [isLoggedIn]);
  return (
    <>
      <ToastContainer />
      {showLogin ? (
        <MenuItem
          color="inherit"
          onClick={signOutHelper}
          // endIcon={<LogoutIcon />}
        >
          Logout
        </MenuItem>
      ) : (
        <MenuItem
          color="inherit"
          onClick={signInHelper}
          // startIcon={<GoogleIcon size="small" />}
        >
          Login
        </MenuItem>
      )}
    </>
  );
}

export default Login;
