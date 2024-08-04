import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { findCookieByKey } from "./util";

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = findCookieByKey("access_token");
    if (accessToken) {
      navigate("/game", { replace: true });
    }
  }, []);

  const handleAuthorize = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/auth/login`).then((res) => {
      const { url } = res.data;
      window.location.href = url;
    });
  };
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-slate-100">
      <div className="bg-white flex flex-col gap-4 items-center p-8 shadow-md rounded-md">
        <h1 className="text-2xl">Your Top Songs Quiz</h1>
        <p className="text-sm">Think you know your top songs on Spotify?</p>
        <button
          className="bg-green-400 rounded-md px-4 py-1 text-lg"
          onClick={handleAuthorize}
        >
          Try it out!
        </button>
      </div>
    </div>
  );
};

export default App;
