import React, { useEffect, useState } from "react";
import axios from "axios";
import SongList from "../components/SongList";
import GuessesList from "../components/GuessesList";
import { findCookieByKey } from "../util";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { v4 as uuidv4 } from "uuid";

const Game = () => {
  const [songs, setSongs] = useState([]);
  const [index, setIndex] = useState(0);
  const [guesses, setAnswers] = useState(
    Array(10)
      .fill()
      .map(() => {
        return { id: uuidv4(), value: null, correct: null };
      })
  );

  const [selected, setSelected] = useState(false);
  const [swap, setSwap] = useState(null);
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

  const placeGuess = (e, value = null) => {
    if (songs.length > 0) {
      if (!selected) {
        return;
      }
      const newAnswers = answers;
      const answerIndex = e.target.id;
      const currentSong = songs[index];
      newAnswers[answerIndex].value = currentSong;
      setAnswers(() => {
        setSelected(null);
        localStorage.setItem("answers", JSON.stringify(newAnswers));
        return newAnswers;
      });
      const newSongs = songs.filter((song) => song.id !== currentSong.id);
      setSongs(newSongs);
      localStorage.setItem("songs", JSON.stringify(newSongs));
    } else {
      if (value) {
        if (swap) {
          if (swap.id === value.id) {
            setSwap(null);
            return;
          }
          const valueId = value.id;
          const currValue = value.value;
          const newAnswers = answers;
          const index = newAnswers.findIndex((answer) => answer.id === valueId);
          newAnswers[index].value = swap.value;
          const swapIndex = newAnswers.findIndex(
            (answer) => answer.id === swap.id
          );
          newAnswers[swapIndex].value = currValue;
          setAnswers(() => {
            setSwap(null);
            localStorage.setItem("answers", JSON.stringify(newAnswers));
            return newAnswers;
          });
        } else {
          setSwap(value);
        }
      }
    }
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
          .get(`${import.meta.env.VITE_API_URL}/songs/top?shuffled=true`, {
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

  const gradeAnswers = (e) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/songs/top`, {
        withCredentials: true,
      })
      .then((res) => {
        const correctAnswers = res.data;
        const correctedAnswers = answers;
        for (let i = 0; i < correctAnswers.length; i++) {
          const answer = correctAnswers[i];
          const guess = answers[i];
          if (answer.id !== guess.value.id) {
            correctedAnswers[i].correct = false;
          } else {
            correctedAnswers[i].correct = true;
          }
        }
        setAnswers(() => {
          localStorage.setItem("answers", JSON.stringify(correctedAnswers));
          return correctedAnswers;
        });
      });
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-2">
      <Navbar />
      <GuessesList
        currentSong={songs[index]}
        guesses={guesses}
        placeGuess={placeGuess}
        selected={selected}
        swap={swap}
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
        <button
          className="bg-black text-white p-1 w-1/2 mx-auto rounded-md mt-4"
          onClick={gradeAnswers}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default Game;
