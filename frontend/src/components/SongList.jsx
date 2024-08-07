import React, { useRef, useState } from "react";
import leftArrowIcon from "../assets/icons/arrow-left-solid.svg";
import rightArrowIcon from "../assets/icons/arrow-right-solid.svg";

const SongItem = ({ song, selected, toggleSelectSong }) => {
  const getArtists = (song) => {
    const artists = song.album.artists.map((artist) => {
      return artist.name;
    });

    return artists.join(", ");
  };

  return (
    <p
      className={` bg-black text-white p-2 rounded-md opacity-75 backdrop-blur-sm cursor-pointer select-none ${
        selected ? "border-green-500 border-4" : ""
      }`}
      onClick={(e) => toggleSelectSong(e, song)}
    >
      {song.name} - {getArtists(song)}
    </p>
  );
};

const SongList = ({
  song,
  incrementIndex,
  decrementIndex,
  selected,
  toggleSelectSong,
}) => {
  return (
    <div className="flex justify-between gap-4 p-4 mt-auto mb-0">
      <button onClick={decrementIndex}>
        <img width={15} height={15} src={leftArrowIcon} alt="left arrow" />
      </button>
      <SongItem
        song={song}
        selected={selected}
        toggleSelectSong={toggleSelectSong}
      />
      <button onClick={incrementIndex}>
        <img width={15} height={15} src={rightArrowIcon} alt="" />
      </button>
    </div>
  );
};

export default SongList;
