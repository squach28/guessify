import React, { useRef, useState } from "react";
import Draggable from "react-draggable";

const SongItem = ({ song }) => {
  const nodeRef = useRef(null);

  const handleStart = (e) => {
    console.log(e);
  };

  return (
    <Draggable nodeRef={nodeRef} onStart={handleStart}>
      <div ref={nodeRef} className="w-1/4 h-1/4 relative">
        <p className="absolute bg-black text-white p-2 rounded-md opacity-75 backdrop-blur-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {song.name}
        </p>
        <img
          width={song.album.images[0].width}
          height={song.album.images[0].height}
          src={song.album.images[0].url}
          alt=""
          draggable={false}
        />
      </div>
    </Draggable>
  );
};

const SongList = ({ songs }) => {
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
    <div className="flex justify-between gap-8 p-4 mt-auto mb-0">
      <button onClick={decrementIndex}>Previous</button>
      <SongItem song={songs[index]} />
      <button onClick={incrementIndex}>Next</button>
    </div>
  );
};

export default SongList;
