import React, { useEffect, useState } from "react";

const GuessItem = ({ guess, placeGuess, selected, index }) => {
  return (
    <li
      key={guess.id}
      id={index}
      className={`border border-black p-1 w-[90%] md:max-w-lg mx-auto text-sm rounded-md hover:cursor-pointer 
    ${
      selected
        ? selected.id === guess.id
          ? "border-blue-800 shadow-md border-2"
          : ""
        : "border-black"
    }
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

const AnswerItem = ({ answer }) => {
  return (
    <li
      className={`border border-green-500 p-1 w-[90%] md:max-w-lg mx-auto text-sm rounded-md hover:cursor-pointer`}
    >
      {answer.name} - {answer.artists}
    </li>
  );
};

const GuessesList = ({ game, selected, placeGuess, answers }) => {
  if (answers) {
    answers.sort((a, b) => {
      if (a.rank < b.rank) {
        return -1;
      }

      if (a.rank > b.rank) {
        return 1;
      }

      return 0;
    });
  }

  return (
    <ol
      className={`w-full list-decimal list-inside flex flex-col justify-between gap-6`}
    >
      {answers !== null ? (
        <>
          {game.guesses.map((guess, index) => {
            return <AnswerItem key={guess.id} answer={answers[index]} />;
          })}
        </>
      ) : (
        <>
          {game.guesses.map((guess, index) => (
            <GuessItem
              key={guess.id}
              guess={guess}
              placeGuess={placeGuess}
              selected={selected}
              index={index}
            />
          ))}
        </>
      )}
    </ol>
  );
};

export default GuessesList;
