import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

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
  return (
    <div>
      <Navbar />
      {connected ? (
        <p>You already connected your account, nice!</p>
      ) : (
        <button>Connect your account</button>
      )}
    </div>
  );
};

export default Home;
