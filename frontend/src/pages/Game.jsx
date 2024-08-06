import React, { useEffect, useState } from "react";
import axios from "axios";
import SongList from "../components/SongList";
import AnswerList from "../components/AnswerList";
import { findCookieByKey } from "../util";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Game = () => {
  const [songs, setSongs] = useState([]);
  const [dragState, setDragState] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    setDragState(true);
    console.log("dragging!");
  };

  const handleDragStop = (e) => {
    setDragState(false);
    console.log("dragging stopped!");
  };

  useEffect(() => {
    if (findCookieByKey("access_token") === null) {
      navigate("/", { replace: true });
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/songs/top`, {
        withCredentials: true,
      })
      .then((res) => setSongs(res.data));
  }, []);

  return songs.length > 0 ? (
    <div className="w-full min-h-screen flex flex-col gap-2">
      <Navbar />
      <AnswerList dragState={dragState} />
      <SongList
        songs={songs}
        handleDrag={handleDrag}
        handleDragStop={handleDragStop}
      />
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Game;
