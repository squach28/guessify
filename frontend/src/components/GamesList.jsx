import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const GameItem = ({ game }) => {
  const date = new Date(game.date);
  const navigate = useNavigate();

  const convertDateToMonthAndDay = (date) => {
    const options = {
      year: "numeric",
      month: "long",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const dateWithoutTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleGameItemClick = () => {
    navigate(`/game?id=${game.game_id}&date=${dateWithoutTime(date)}`);
  };

  return (
    <li
      className="flex flex-col items-center p-3 bg-gray-100 text-black rounded-md shadow-md gap-2 hover:cursor-pointer"
      onClick={handleGameItemClick}
    >
      <p className="text-2xl">{convertDateToMonthAndDay(date)}</p>
      <p className="text-xl">{game.username}'s top 10</p>
    </li>
  );
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
        <GameItem key={game.game_id} game={game} />
      ))}
    </ul>
  );
};

export default GamesList;
