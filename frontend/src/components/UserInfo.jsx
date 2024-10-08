import React, { useState } from "react";
import penIcon from "../assets/icons/user-pen-solid.svg";
import axios from "axios";

const UserInfo = ({ user }) => {
  const [loading, setLoading] = useState(false);

  const uploadImage = (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (file === undefined) {
      return;
    }
    const formData = new FormData();
    formData.append("avatar", file);
    axios
      .put(`${import.meta.env.VITE_API_URL}/users/profilePicture`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="relative">
        <img
          width={150}
          height={150}
          className={`mx-auto rounded-full w-[150px] h-[150px] ${
            loading ? "opacity-50" : "opacity-100"
          }`}
          src={user.imageUrl}
          alt="profile picture"
        />
        <div className="absolute right-[80px] bottom-[-5px] border-black bg-white rounded-full p-2 hover:cursor-pointer">
          <label className="hover:cursor-pointer" htmlFor="avatar">
            <img width={20} height={20} src={penIcon} />
          </label>
          <input
            id="avatar"
            className="hidden"
            type="file"
            accept="image/png, image/jpeg"
            name="avatar"
            onChange={uploadImage}
            disabled={loading}
          />
        </div>
      </div>
      <h2 className="font-bold text-2xl">Basic Info</h2>
      <div>
        <span className="font-bold">Username: </span>
        <span>{user.username}</span>
      </div>
      <div>
        <span className="font-bold">Email: </span>
        <span>{user.email}</span>
      </div>
      <div>
        <span className="font-bold">Connected with Spotify: </span>
        {user.spotifyId ? (
          <span>Connected!</span>
        ) : (
          <span>Not connected yet</span>
        )}
      </div>
      <button className="w-full bg-red-500 text-white font-bold px-1 py-2 rounded-md">
        Delete account
      </button>
    </div>
  );
};

export default UserInfo;
