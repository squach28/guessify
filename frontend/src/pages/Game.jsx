import React, { useEffect, useState } from "react";
import axios from "axios";
import SongList from "../components/SongList";
import GuessesList from "../components/GuessesList";
import { findCookieByKey } from "../util";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const Game = () => {
  const [game, setGame] = useState({
    options: [],
    guesses: Array(10)
      .fill()
      .map(() => {
        return { id: uuidv4(), value: null, correct: null };
      }),
  });
  const [index, setIndex] = useState(0);
  const [sessionId, setSessionId] = useState(null);
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
    const date = new Date();
    getSession(gameId, date)
      .then((result) => {
        console.log(result);
        setSessionId(result.sessionId);
        const docRef = doc(db, "sessions", result.sessionId);
        getDoc(docRef).then((doc) => {
          const docGuesses = doc.data().guesses;
          const docOptions = doc.data().options;
          setGame({
            ...game,
            guesses: docGuesses,
            options: docOptions,
          });
        });
      })
      .catch((e) => {
        if (e.response.status === 404) {
          fetchSongs().then((songs) => {
            createSession(gameId, game.guesses, songs).then((result) => {
              const docRef = doc(db, "sessions", result.id);
              getDoc(docRef).then((doc) => {
                const docGuesses = doc.data().guesses;
                const docOptions = doc.data().options;
                setGame({
                  ...game,
                  guesses: docGuesses,
                  options: docOptions,
                });
              });
            });
          });
        }
      });
  }, []);

  const getSession = async (gameId, date) => {
    return axios
      .get(`${import.meta.env.VITE_API_URL}/sessions/${gameId}`, {
        withCredentials: true,
      })
      .then((res) => res.data);
  };

  const createSession = async (gameId, guesses, options) => {
    return axios
      .post(
        `${import.meta.env.VITE_API_URL}/sessions`,
        {
          gameId,
          guesses: guesses,
          options: options,
        },
        { withCredentials: true }
      )
      .then((res) => res.data);
  };

  const fetchSongs = async () => {
    return axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/answers/${gameId}?shuffled=${true}&withoutRanks=${true}`,
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
        return game.options.length - 1;
      } else {
        return prev - 1;
      }
    });
  };

  const incrementIndex = () => {
    setSelected(false);
    setIndex((prev) => (prev + 1) % game.options.length);
  };

  const toggleSelectSong = (e) => {
    setSelected((prev) => !prev);
  };

  const placeGuess = (e, value = null) => {
    if (game.options.length > 0) {
      if (!selected) {
        return;
      }
      const newGuesses = game.guesses;
      const answerIndex = e.target.id;
      const currentSong = game.options[index];
      newGuesses[answerIndex].value = currentSong;
      setGame(() => {
        setSelected(null);
        updateDoc(doc(db, "sessions", sessionId), {
          guesses: newGuesses,
        });
        return { ...game, guesses: newGuesses };
      });
      const newSongs = game.options.filter(
        (song) => song.id !== currentSong.id
      );
      setGame(() => {
        const docRef = doc(db, "sessions", sessionId);
        updateDoc(docRef, {
          options: newSongs,
        });
        return {
          ...game,
          options: newSongs,
        };
      });
    } else {
      if (value) {
        if (swap) {
          if (swap.id === value.id) {
            setSwap(null);
            return;
          }
          const valueId = value.id;
          const currValue = value.value;
          const newGuesses = game.guesses;
          const index = newGuesses.findIndex((guess) => guess.id === valueId);
          newGuesses[index].value = swap.value;
          const swapIndex = newGuesses.findIndex(
            (guess) => guess.id === swap.id
          );
          newGuesses[swapIndex].value = currValue;
          setGame(() => {
            setSwap(null);
            const docRef = doc(db, "sessions", sessionId);
            updateDoc(docRef, {
              guesses: newGuesses,
            });
            return {
              ...game,
              guesses: newGuesses,
            };
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
        const correctedAnswers = game.guesses;
        for (let i = 0; i < correctAnswers.length; i++) {
          const answer = correctAnswers[i];
          const guess = game.guessesguesses[i];
          if (answer.id !== guess.value.id) {
            correctedAnswers[i].correct = false;
          } else {
            correctedAnswers[i].correct = true;
          }
        }
        setGame({
          ...game,
          guesses: correctedAnswers,
        });
      });
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-2">
      <Navbar />
      <GuessesList
        currentSong={game.options[index]}
        guesses={game.guesses}
        placeGuess={placeGuess}
        selected={selected}
        swap={swap}
      />
      {game.options.length > 0 ? (
        <SongList
          song={game.options[index]}
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
