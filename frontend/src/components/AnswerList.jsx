import React from "react";

const AnswerList = ({ answers, selected, placeAnswer, swap }) => {
  const getArtists = (artists) => {
    const res = artists.map((artist) => {
      return artist.name;
    });

    return res.join(", ");
  };
  return (
    <ol
      className={`w-full list-decimal list-inside flex flex-col justify-between gap-6`}
    >
      {answers.map((answer, index) => (
        <li
          key={answer.id}
          id={index}
          className={`border border-black p-1 w-[90%] md:max-w-lg mx-auto text-sm rounded-md hover:cursor-pointer ${
            selected
              ? answer.value
                ? "border-black"
                : "border-blue-800 shadow-md"
              : "border-black"
          }
          ${swap && swap.id === answer.id ? "border-orange-500" : ""}`}
          onClick={(e) => placeAnswer(e, answer)}
        >
          {answer.value
            ? `${answer.value.name} - ${getArtists(answer.value.artists)}`
            : ""}
        </li>
      ))}
    </ol>
  );
};

export default AnswerList;
