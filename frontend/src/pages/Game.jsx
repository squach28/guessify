import React, { useEffect, useState } from "react";
import axios from "axios";
import SongList from "../components/SongList";
import GuessesList from "../components/GuessesList";
import { findCookieByKey } from "../util";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { v4 as uuidv4 } from "uuid";

const Game = () => {
  const [songs, setSongs] = useState([]);
  const [index, setIndex] = useState(0);
  const [guesses, setGuesses] = useState(
    Array(10)
      .fill()
      .map(() => {
        return { id: uuidv4(), value: null, correct: null };
      })
  );
  const [selected, setSelected] = useState(false);
  const [swap, setSwap] = useState(null);
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const gameId = query.get("id");

  useEffect(() => {
    if (findCookieByKey("spotify_access_token") === null) {
      navigate("/", { replace: true });
    }
    fetchSongs().then((result) => setSongs(result));
    getSession(gameId)
      .then((result) => console.log(result))
      .catch((e) => {
        if (e.response.status === 404) {
          createSession(gameId);
        }
      });
  }, []);

  const getSession = async (gameId) => {
    return axios
      .get(`${import.meta.env.VITE_API_URL}/sessions/${gameId}`, {
        withCredentials: true,
      })
      .then((res) => res.data);
  };

  const createSession = async (gameId) => {
    return axios
      .post(
        `${import.meta.env.VITE_API_URL}/sessions`,
        {
          gameId,
        },
        { withCredentials: true }
      )
      .then((res) => res.data);
  };

  const fetchSongs = async () => {
    return axios
      .get(
        `${import.meta.env.VITE_API_URL}/answers/${gameId}?shuffled=${true}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => res.data);
  };

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
      const newGuesses = guesses;
      const answerIndex = e.target.id;
      const currentSong = songs[index];
      newGuesses[answerIndex].value = currentSong;
      setGuesses(() => {
        setSelected(null);
        return newGuesses;
      });
      const newSongs = songs.filter((song) => song.id !== currentSong.id);
      setSongs(newSongs);
    } else {
      if (value) {
        if (swap) {
          if (swap.id === value.id) {
            setSwap(null);
            return;
          }
          const valueId = value.id;
          const currValue = value.value;
          const newGuesses = guesses;
          const index = newGuesses.findIndex((guess) => guess.id === valueId);
          newGuesses[index].value = swap.value;
          const swapIndex = newGuesses.findIndex(
            (guess) => guess.id === swap.id
          );
          newGuesses[swapIndex].value = currValue;
          setGuesses(() => {
            setSwap(null);
            return newGuesses;
          });
        } else {
          setSwap(value);
        }
      }
    }
  };

  const gradeAnswers = (e) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/songs/top`, {
        withCredentials: true,
      })
      .then((res) => {
        const correctAnswers = res.data;
        const correctedAnswers = guesses;
        for (let i = 0; i < correctAnswers.length; i++) {
          const answer = correctAnswers[i];
          const guess = guesses[i];
          if (answer.id !== guess.value.id) {
            correctedAnswers[i].correct = false;
          } else {
            correctedAnswers[i].correct = true;
          }
        }
        setGuesses(() => {
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
          className="bg-black text-white p-1 w-1/2 md:max-w-lg mx-auto rounded-md mt-4"
          onClick={gradeAnswers}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default Game;
