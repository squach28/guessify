import React, { useEffect, useState } from "react";
import axios from "axios";
const GameItem = ({ game }) => {
  const date = new Date(game.date);
  const convertDateToMonthAndDay = (date) => {
    const options = {
      year: "numeric",
      month: "long",
    };
    return date.toLocaleDateString("en-US", options);
  };
  return <li>{convertDateToMonthAndDay(date)}</li>;
};

const GamesList = () => {
  const [games, setGames] = useState([]);
  // TODO: fetch the current user's games that they haven't played
  // this should be the game of the month
  useEffect(() => {
    fetchGamesForCurrentUser().then((result) => {
      setGames(result);
    });
  }, []);

  const fetchGamesForCurrentUser = async () => {
    return axios
      .get(`${import.meta.env.VITE_API_URL}/games/me`, {
        withCredentials: true,
      })
      .then((res) => res.data);
  };
  return (
    <ul>
      {games.map((game) => (
        <GameItem game={game} />
      ))}
    </ul>
  );
};

export default GamesList;
