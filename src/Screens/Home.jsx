import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Login from "../Components/Login";

function Home() {
  const notify = () => toast("Wow so easy!");
  let navigate = useNavigate();
  return (
    <div>
      Home
      <ToastContainer />
      <button onClick={notify}>Notify!</button>
      <button
        onClick={() => {
          navigate("/chats");
        }}
      >
        Chats
      </button>
      <Login />
    </div>
  );
}

export default Home;
