import React, { useEffect, useState } from "react";
import axios from "axios";
import SongList from "../components/SongList";
import AnswerList from "../components/AnswerList";

const Game = () => {
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/songs/top`, {
        withCredentials: true,
      })
      .then((res) => setSongs(res.data));
  }, []);

  return songs.length > 0 ? (
    <div className="w-full min-h-screen flex flex-col p-8">
      <AnswerList />
      <SongList songs={songs} />
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Game;
