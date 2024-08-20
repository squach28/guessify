import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user.id) {
          navigate("/home", { replace: true });
        }
      })
      .catch();
  }, []);

  const handleAuthorize = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/auth/login`).then((res) => {
      const { url } = res.data;
      window.location.href = url;
    });
  };

  const getCurrentUser = async () => {
    return axios
      .get(`${import.meta.env.VITE_API_URL}/users/user/me`, {
        withCredentials: true,
      })
      .then((res) => res.data);
  };
  return (
    <div className="w-full flex flex-col min-h-screen bg-slate-100">
      <Navbar />
      <div className="w-[90%] md:max-w-lg mx-auto bg-white flex flex-col gap-4 items-center p-8 shadow-md rounded-md my-auto">
        <h1 className="text-2xl">Your Top Songs Quiz</h1>
        <p className="text-sm">Think you know your top songs on Spotify?</p>
        <Link
          to="/login"
          className="bg-green-400 rounded-md px-4 py-1 text-lg"
          onClick={handleAuthorize}
        >
          Try it out!
        </Link>
      </div>
    </div>
  );
};

export default App;
