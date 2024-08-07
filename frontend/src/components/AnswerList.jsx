import React from "react";

const AnswerList = ({ answers, selected, placeAnswer }) => {
  return (
    <ol
      className={`w-full list-decimal list-inside flex flex-col justify-between gap-5`}
    >
      {answers.map((answer, index) => (
        <li
          key={answer.id}
          id={index}
          className={`border border-black p-1 w-[90%] md:max-w-lg mx-auto rounded-md hover:cursor-pointer ${
            selected
              ? answer.value
                ? "border-black"
                : "border-blue-800 shadow-md"
              : "border-black"
          }`}
          onClick={(e) => placeAnswer(e, answer)}
        >
          {answer.value ? answer.value.name : ""}
        </li>
      ))}
    </ol>
  );
};

export default AnswerList;
