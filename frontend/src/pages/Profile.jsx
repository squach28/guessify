import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useFetch } from "../hooks/useFetch";
import UserInfo from "../components/UserInfo";

const Profile = () => {
  const { data, isLoading, error } = useFetch(
    `${import.meta.env.VITE_API_URL}/users/user/me`
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="h-full flex flex-col items-center mt-8">
        {isLoading ? <p>Loading...</p> : null}
        {data ? <UserInfo user={data} /> : null}
      </div>
    </div>
  );
};

export default Profile;
