import React, { useState } from "react";

const AnswerList = ({ dragState }) => {
  const [answers, setAnswers] = useState(Array(10).fill(""));
  const handleMouseEnter = (e) => {
    console.log(e);
  };
  return (
    <ol
      className={`list-decimal list-inside flex flex-col justify-between gap-5 max-w-lg`}
    >
      {answers.map((answer, index) => (
        <li
          key={index}
          className={`border border-black p-1 rounded-md ${
            dragState ? "border-blue-800 border-2" : "border-black"
          }`}
          onDragOver={handleMouseEnter}
        >
          {answer}
        </li>
      ))}
    </ol>
  );
};

export default AnswerList;
