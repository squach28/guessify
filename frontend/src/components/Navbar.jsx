import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFetch } from "../hooks/useFetch";

const Menu = () => {
  return (
    <ul className="w-[75px] flex flex-col gap-1 bg-gray-400 text-white absolute right-0 p-2 rounded-md mt-1">
      <li>Profile</li>
      <li>Log out</li>
    </ul>
  );
};

const Navbar = () => {
  const { data, isLoading, error } = useFetch(
    `${import.meta.env.VITE_API_URL}/users/user/me`
  );
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        navigate("/");
      });
  };

  return (
    <ul className="flex justify-between p-4 bg-black text-white">
      <li>
        <Link to={`${data ? "/home" : "/"}`}>guessify</Link>
      </li>
      {isLoading ? <p>Loading...</p> : null}
      {error ? (
        <div className="flex items-center gap-4">
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
          <li>
            <Link to="/login">Log in</Link>
          </li>
        </div>
      ) : null}
      {data ? (
        <div className="relative">
          <p
            className="hover:cursor-pointer"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            {data.username}
          </p>
          {showMenu ? <Menu /> : null}
        </div>
      ) : null}
    </ul>
  );
};

export default Navbar;
