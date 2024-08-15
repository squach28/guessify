import React from "react";

const GuessItem = ({ guess, placeGuess, swap, selected, index }) => {
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
  ${swap && swap.id === guess.id ? "border-orange-500" : ""}
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
      {guess.value ? `${guess.value.name} - ${guess.value.artists}` : ""}
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
          key={guess.id}
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
