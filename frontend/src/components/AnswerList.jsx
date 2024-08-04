import React, { useState } from "react";

const AnswerList = () => {
  const [answers, setAnswers] = useState([]);
  return (
    <ol className="list-decimal list-inside flex flex-col justify-between flex-1">
      <li>hello</li>
      <li>f</li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ol>
  );
};

export default AnswerList;
