import React, { useEffect, useState } from "react";
import axios from "axios";
import SongList from "../components/SongList";
import AnswerList from "../components/AnswerList";
import { findCookieByKey } from "../util";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Game = () => {
  const [songs, setSongs] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(10).fill(""));
  const [selected, setSelected] = useState(false);
  const navigate = useNavigate();

  const decrementIndex = () => {
    setSelected(false);
    setIndex((prev) => {
      if (prev - 1 < 0) {
        return songs.length - 1;
      } else {
        return prev - 1;
      }
    });
  };

  const incrementIndex = () => {
    setSelected(false);
    setIndex((prev) => (prev + 1) % songs.length);
  };

  const toggleSelectSong = (e) => {
    setSelected((prev) => !prev);
  };

  const placeAnswer = (e) => {
    const newAnswers = answers;
    const answerIndex = e.target.id;
    const currentSong = songs[index].name;
    newAnswers[answerIndex] = currentSong;
    setAnswers(() => {
      setSelected(null);
      return newAnswers;
    });
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
      <AnswerList
        currentSong={songs[index]}
        answers={answers}
        placeAnswer={placeAnswer}
        selected={selected}
      />
      <SongList
        song={songs[index]}
        incrementIndex={incrementIndex}
        decrementIndex={decrementIndex}
        toggleSelectSong={toggleSelectSong}
        selected={selected}
      />
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Game;
