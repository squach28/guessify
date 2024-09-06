import React, { useEffect, useState } from "react";
import axios from "axios";
import SongList from "../components/SongList";
import GuessesList from "../components/GuessesList";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const Game = () => {
  const [game, setGame] = useState({
    options: [],
    guesses: Array(10)
      .fill()
      .map(() => {
        return { id: uuidv4(), value: null, correct: null };
      }),
    status: null,
  });
  const [index, setIndex] = useState(0);
  const [session, setSession] = useState(null);
  const [selected, setSelected] = useState(false);
  const [swap, setSwap] = useState(null);
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const gameId = query.get("id");
  const date = new Date(query.get("date"));
  date.setDate(date.getDate() + 1);

  useEffect(() => {
    getSessionByGameId(gameId)
      .then((result) => {
        const docRef = doc(db, "sessions", result.sessionId);
        setSession(docRef);
        getDoc(docRef).then((doc) => {
          const docGuesses = doc.data().guesses;
          const docOptions = doc.data().options;
          const docStatus = doc.data().status;
          setGame({
            ...game,
            guesses: docGuesses,
            options: docOptions,
            status: docStatus,
          });
        });
      })
      .catch((e) => {
        if (e.response.status === 404) {
          fetchSongs().then((songs) => {
            createSession(gameId, game.guesses, songs).then((result) => {
              const docRef = doc(db, "sessions", result.id);
              setSession(docRef);
              getDoc(docRef).then((doc) => {
                const docGuesses = doc.data().guesses;
                const docOptions = doc.data().options;
                const docStatus = doc.data().status;
                setGame({
                  ...game,
                  guesses: docGuesses,
                  options: docOptions,
                  status: docStatus,
                });
              });
            });
          });
        }
      });
  }, []);

  const getSessionByGameId = async () => {
    return axios
      .get(`${import.meta.env.VITE_API_URL}/sessions?gameId=${gameId}`, {
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
    if (game.status === "COMPLETE") {
      return;
    }
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
        updateDoc(session, {
          guesses: newGuesses,
        });
        return { ...game, guesses: newGuesses };
      });
      const newSongs = game.options.filter(
        (song) => song.id !== currentSong.id
      );
      setGame(() => {
        if (game.options.length === 1) {
          updateDoc(session, {
            options: newSongs,
            status: "READY_TO_SUBMIT",
          });
          return {
            ...game,
            options: newSongs,
            status: "READY_TO_SUBMIT",
          };
        } else {
          updateDoc(session, {
            options: newSongs,
          });
          return {
            ...game,
            options: newSongs,
          };
        }
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
            updateDoc(session, {
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
    const correctedGuesses = game.guesses;
    fetchAnswers().then((answers) => {
      answers.forEach((answer) => {
        const { rank, id } = answer;
        const index = rank - 1;
        const guess = correctedGuesses[index]; // rank starts at 1, guesses starts at 0
        if (guess.id !== id) {
          guess.correct = false;
        } else {
          guess.correct = true;
        }
      });
      setGame(() => {
        updateDoc(session, {
          guesses: correctedGuesses,
          status: "COMPLETE",
        });
        return {
          ...game,
          guesses: correctedGuesses,
          status: "COMPLETE",
        };
      });
    });
  };

  const fetchAnswers = async () => {
    return axios
      .get(`${import.meta.env.VITE_API_URL}/answers/${gameId}`, {
        withCredentials: true,
      })
      .then((res) => res.data);
  };

  const renderBasedOnGameStatus = () => {
    switch (game.status) {
      case "IN_PROGRESS":
        return (
          <SongList
            song={game.options[index]}
            incrementIndex={incrementIndex}
            decrementIndex={decrementIndex}
            toggleSelectSong={toggleSelectSong}
            selected={selected}
          />
        );
      case "READY_TO_SUBMIT":
        return (
          <button
            className="bg-black text-white p-1 w-1/2 md:max-w-lg mx-auto rounded-md my-4"
            onClick={gradeAnswers}
          >
            Submit
          </button>
        );
      case "COMPLETE":
        const correctGuesses = game.guesses.reduce((acc, guess) => {
          if (guess.correct) {
            return acc + 1;
          } else {
            return acc;
          }
        }, 0);
        return (
          <div className="flex flex-col items-center mx-auto pb-4">
            <p className="text-3xl font-bold">Score</p>
            <div className="flex gap-1 text-lg">
              <span>{correctGuesses}</span>
              <span>/</span>
              <span>{game.guesses.length}</span>
            </div>
            <button className="bg-black text-white px-4 py-2 my-2 rounded-md">
              See Correct Answers
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-2">
      <Navbar />
      <p className="mx-auto font-bold text-2xl py-4">
        {date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </p>
      <GuessesList
        game={game}
        placeGuess={placeGuess}
        selected={selected}
        swap={swap}
      />

      {renderBasedOnGameStatus()}
    </div>
  );
};

export default Game;
