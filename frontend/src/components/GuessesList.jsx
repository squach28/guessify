import React from "react";

const GuessItem = ({ guess, placeGuess, swap, selected, index }) => {
  const getArtists = (artists) => {
    const res = artists.map((artist) => {
      return artist.name;
    });

    return res.join(", ");
  };
  return (
    <li
      key={guess.id}
      id={index}
      className={`border border-black p-1 w-[90%] md:max-w-lg mx-auto text-sm rounded-md hover:cursor-pointer 
    ${
      selected
        ? guess.value
          ? "border-black"
          : "border-blue-800 shadow-md"
        : ""
    }
  ${swap && swap.id === answer.id ? "border-orange-500" : ""}
  ${
    guess.correct !== null
      ? guess.correct
        ? "border-green-500"
        : "border-red-500"
      : "border-black"
  }
  `}
      onClick={(e) => placeGuess(e, guess)}
    >
      {guess.value
        ? `${guess.value.name} - ${getArtists(guess.value.artists)}`
        : ""}
    </li>
  );
};

const GuessesList = ({ guesses, selected, placeGuess, swap }) => {
  return (
    <ol
      className={`w-full list-decimal list-inside flex flex-col justify-between gap-6`}
    >
      {guesses.map((guess, index) => (
        <GuessItem
          guess={guess}
          placeGuess={placeGuess}
          swap={swap}
          selected={selected}
          index={index}
        />
      ))}
    </ol>
  );
};

export default GuessesList;
