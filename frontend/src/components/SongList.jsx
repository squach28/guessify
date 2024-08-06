import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import leftArrowIcon from "../assets/icons/arrow-left-solid.svg";
import rightArrowIcon from "../assets/icons/arrow-right-solid.svg";

const SongItem = ({ song, handleDrag, handleDragStop }) => {
  const nodeRef = useRef(null);

  const getArtists = (song) => {
    const artists = song.album.artists.map((artist) => {
      return artist.name;
    });

    return artists.join(", ");
  };

  return (
    <p
      className=" bg-black text-white p-2 rounded-md opacity-75 backdrop-blur-sm"
      draggable={true}
      onClick={(e) => e.preventDefault()}
      onTouchStart={handleDrag}
    >
      {song.name} - {getArtists(song)}
    </p>
  );
};

const SongList = ({ songs, handleDrag, handleDragStop }) => {
  const [index, setIndex] = useState(0);

  const decrementIndex = () => {
    setIndex((prev) => {
      if (prev - 1 < 0) {
        return songs.length - 1;
      } else {
        return prev - 1;
      }
    });
  };

  const incrementIndex = () => {
    setIndex((prev) => (prev + 1) % songs.length);
  };

  return (
    <div className="flex justify-between gap-4 p-4 mt-auto mb-0">
      <button onClick={decrementIndex}>
        <img width={15} height={15} src={leftArrowIcon} alt="left arrow" />
      </button>
      <SongItem
        song={songs[index]}
        handleDrag={handleDrag}
        handleDragStop={handleDragStop}
      />
      <button onClick={incrementIndex}>
        <img width={15} height={15} src={rightArrowIcon} alt="" />
      </button>
    </div>
  );
};

export default SongList;
