import React from "react";
import leftArrowIcon from "../assets/icons/arrow-left-solid.svg";
import rightArrowIcon from "../assets/icons/arrow-right-solid.svg";

const SongItem = ({ song }) => {
  return (
    <p
      className={` bg-black text-white p-2 rounded-md opacity-75 backdrop-blur-sm cursor-pointer select-none
        ${
          song.correct !== null
            ? song.correct
              ? "border-green-500"
              : "border-red-500"
            : ""
        }`}
    >
      {song.name} - {song.artists}
    </p>
  );
};

const SongList = ({ song, incrementIndex, decrementIndex }) => {
  return (
    <div className="flex justify-between gap-4 p-4 mt-auto mb-0">
      <button onClick={decrementIndex}>
        <img width={15} height={15} src={leftArrowIcon} alt="left arrow" />
      </button>
      <SongItem song={song} />
      <button onClick={incrementIndex}>
        <img width={15} height={15} src={rightArrowIcon} alt="" />
      </button>
    </div>
  );
};

export default SongList;
