import React, { useState, useEffect } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { getDatabase, ref, set } from "firebase/database";
import MenuItem from "@mui/material/MenuItem";
import { getMessaging, getToken } from "firebase/messaging";
import { firebaseConfig } from "./../firebaseConfig";
import { initializeApp } from "firebase/app";
function Login() {
  const signin = useStoreActions((actions) => actions.auth.signin);
  const signout = useStoreActions((actions) => actions.auth.signout);
  const isLoggedIn = useStoreState((state) => state.auth.isLoggedIn);
  const vpid_key = import.meta.env.VITE_VPID_KEY;
  const [showLogin, setShowLogin] = useState(false);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const writeUserDetailsToDatabase = (uid, details) => {
    const db = getDatabase();
    set(ref(db, "users/" + uid + "/details"), details);
  };

  const requestNotificationsPermissions = async () => {
    console.log("Requesting notifications permission...");
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");
      // Notification permission granted.
      await setMessagingToken();
    } else {
      console.log("Unable to get permission to notify.");
    }
  };

  const setMessagingToken = (uid) => {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: vpid_key })
      .then((currentToken) => {
        if (currentToken) {
          const db = getDatabase();
          set(ref(db, "users/" + uid + "/fcm_token"), currentToken); //TODO : change it to push intead of set
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
          requestNotificationsPermissions();
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
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
        setMessagingToken(user.uid);
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
