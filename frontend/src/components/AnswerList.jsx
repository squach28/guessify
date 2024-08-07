import React from "react";

const AnswerList = ({ answers, selected, placeAnswer }) => {
  console.log(answers);
  return (
    <ol
      className={`w-full list-decimal list-inside flex flex-col justify-between gap-5`}
    >
      {answers.map((answer, index) => (
        <li
          key={index}
          id={index}
          className={`border border-black p-1 w-[90%] md:max-w-lg mx-auto rounded-md ${
            selected ? (answer === "" ? "border-blue-800" : "") : ""
          }`}
          onClick={placeAnswer}
        >
          {answer}
        </li>
      ))}
    </ol>
  );
};

export default AnswerList;
