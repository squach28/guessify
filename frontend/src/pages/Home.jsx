import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import GamesList from "../components/GamesList";

const Home = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    isConnectedWithSpotify().then((res) => {
      if (res.connected) {
        createGame().then((result) => result);
        setConnected(res.connected);
      }
    });
  }, []);

  const isConnectedWithSpotify = async () => {
    return axios
      .get(`${import.meta.env.VITE_API_URL}/auth/spotify/connected`, {
        withCredentials: true,
      })
      .then((res) => {
        return res.data;
      });
  };

  const createGame = async () => {
    const date = new Date();
    return axios
      .post(
        `${import.meta.env.VITE_API_URL}/games`,
        {
          date,
        },
        {
          withCredentials: true,
        }
      )
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
        <div className="p-4">
          <h1 className="text-3xl">Games</h1>
          <GamesList />
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
