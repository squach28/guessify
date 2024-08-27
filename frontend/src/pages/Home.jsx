import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import GamesList from "../components/GamesList";
import { useFetch } from "../hooks/useFetch";

const Home = () => {
  const { data, isLoading, error } = useFetch(
    `${import.meta.env.VITE_API_URL}/auth/spotify/connected`
  );

  useEffect(() => {
    if (data && data.connected) {
      createGame();
    }
  }, [data]);

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
      {isLoading ? <p>Loading...</p> : null}
      {error ? <p>Something happened, please try again later.</p> : null}
      {data ? (
        data.connected ? (
          <div className="flex flex-col gap-2 p-4">
            <h1 className="text-3xl">Games</h1>
            <GamesList />
          </div>
        ) : (
          <div className="flex flex-col items-center mt-10 gap-2">
            <h1 className="text-xl font-bold text-center">
              Spotify Account Not Connected
            </h1>
            <p>Connect your Spotify account to get started!</p>
            <button
              className="bg-green-500 font-bold text-white p-2 mx-auto rounded-md shadow-md"
              onClick={handleConnectAccount}
            >
              Connect your Spotify account
            </button>
          </div>
        )
      ) : null}
    </div>
  );
};

export default Home;
