import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

const Profile = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useFetch(
    `${import.meta.env.VITE_API_URL}/users/user/me`
  );

  console.log(data);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="h-full flex flex-col items-center mt-8">
        {isLoading ? <p>Loading...</p> : null}
        {data ? (
          <div className="h-full flex flex-col gap-4">
            <img
              width={100}
              height={100}
              className="mx-auto"
              src={data.imageUrl}
              alt="profile picture"
            />
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
