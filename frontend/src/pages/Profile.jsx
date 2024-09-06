import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useFetch } from "../hooks/useFetch";
import penIcon from "../assets/icons/user-pen-solid.svg";
import axios from "axios";

const Profile = () => {
  const { data, isLoading, error } = useFetch(
    `${import.meta.env.VITE_API_URL}/users/user/me`
  );

  const uploadImage = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);
    axios.put(
      `${import.meta.env.VITE_API_URL}/users/profilePicture`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="h-full flex flex-col items-center mt-8">
        {isLoading ? <p>Loading...</p> : null}
        {data ? (
          <div className="h-full flex flex-col gap-4">
            <div className="relative">
              <img
                width={150}
                height={150}
                className="mx-auto rounded-full w-[150px] h-[150px]"
                src={data.imageUrl}
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
                />
              </div>
            </div>
            <div>
              <span className="font-bold">Username: </span>
              <span>{data.username}</span>
            </div>
            <div>
              <span className="font-bold">Email: </span>
              <span>{data.email}</span>
            </div>
            <div>
              <span className="font-bold">Connected with Spotify: </span>
              {data.spotifyId ? (
                <span>Connected!</span>
              ) : (
                <span>Not connected yet</span>
              )}
            </div>
            <button className="w-full bg-red-500 text-white font-bold px-1 py-2 rounded-md">
              Delete account
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
