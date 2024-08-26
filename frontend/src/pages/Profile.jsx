import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  console.log(id);
  useEffect(() => {}, []);
  return (
    <div>
      <Navbar />
    </div>
  );
};

export default Profile;
