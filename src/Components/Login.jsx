import React, { useEffect } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login() {
  const signin = useStoreActions((actions) => actions.auth.signin);
  const signout = useStoreActions((actions) => actions.auth.signout);
  const isLoggedIn = useStoreState((state) => state.auth.isLoggedIn);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const signInHelper = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        localStorage.setItem("userInfo", JSON.stringify(user));
        signin(user);
      })
      .catch((error) => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userInfo");
        toast.error(errorMessage);
        // const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  const signOutHelper = () => {
    signOut(auth)
      .then(() => {
        signout();
        toast("Logged out");
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };
  return (
    <div>
      <ToastContainer />
      {isLoggedIn ? (
        <button onClick={signOutHelper}>Logout!</button>
      ) : (
        <button onClick={signInHelper}>Login!</button>
      )}
    </div>
  );
}

export default Login;
