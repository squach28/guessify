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
    const currentSong = songs[index];
    newAnswers[answerIndex] = currentSong.name;
    setAnswers(() => {
      setSelected(null);
      localStorage.setItem("answers", JSON.stringify(newAnswers));
      return newAnswers;
    });
    const newSongs = songs.filter((song) => song.id !== currentSong.id);
    setSongs(newSongs);
    localStorage.setItem("songs", JSON.stringify(newSongs));
  };

  useEffect(() => {
    if (findCookieByKey("access_token") === null) {
      navigate("/", { replace: true });
    } else {
      if (localStorage.getItem("songs")) {
        const topSongs = JSON.parse(localStorage.getItem("songs"));
        setSongs(topSongs);
      } else {
        axios
          .get(`${import.meta.env.VITE_API_URL}/songs/top`, {
            withCredentials: true,
          })
          .then((res) => {
            const topSongs = res.data;
            localStorage.setItem("songs", JSON.stringify(topSongs));
            setSongs(topSongs);
          });
      }
    }
    if (localStorage.getItem("answers")) {
      const prevAnswers = localStorage.getItem("answers");
      setAnswers(JSON.parse(prevAnswers));
    }
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col gap-2">
      <Navbar />
      <AnswerList
        currentSong={songs[index]}
        answers={answers}
        placeAnswer={placeAnswer}
        selected={selected}
      />
      {songs.length > 0 ? (
        <SongList
          song={songs[index]}
          incrementIndex={incrementIndex}
          decrementIndex={decrementIndex}
          toggleSelectSong={toggleSelectSong}
          selected={selected}
        />
      ) : (
        <button>Submit</button>
      )}
    </div>
  );
};

export default Game;
