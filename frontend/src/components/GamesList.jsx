import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import axios from "axios";

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

const GamesList = ({ connected }) => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (connected) {
      createGame().then(() => {
        fetchGames().then((res) => {
          setIsLoading(false);
          setGames(res.data);
        });
      });
    }
  }, []);

  const createGame = async () => {
    const date = new Date();
    return axios
      .post(
        `${import.meta.env.VITE_API_URL}/games`,
        {
          date,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => res.data);
  };

  const fetchGames = () => {
    return axios.get(`${import.meta.env.VITE_API_URL}/games/me`, {
      withCredentials: true,
    });
  };

  return (
    <>
      {isLoading ? <p>Loading...</p> : null}
      {games ? (
        <ul className="">
          {games.map((game) => (
            <GameItem key={game.game_id} game={game} />
          ))}
        </ul>
      ) : null}
    </>
  );
};

export default GamesList;
