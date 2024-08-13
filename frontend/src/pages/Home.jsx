import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    isConnectedWithSpotify().then((res) => setConnected(res.connected));
  }, []);

  const isConnectedWithSpotify = async () => {
    return axios
      .get(`${import.meta.env.VITE_API_URL}/auth/spotify/connected`, {
        withCredentials: true,
      })
      .then((res) => res.data);
  };

  const handleConnectAccount = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/auth/spotify/login`, {
        withCredentials: true,
      })
      .then((res) => {
        const { url } = res.data;
        window.location.href = url;
      });
  };

  return (
    <div className="w-full h-min-screen">
      <Navbar />
      {connected ? (
        <div>
          <p>You already connected your account, nice!</p>
          <Link to="/game">Play</Link>
        </div>
      ) : (
        <button className="text-center" onClick={handleConnectAccount}>
          Connect your account
        </button>
      )}
    </div>
  );
};

export default Home;
