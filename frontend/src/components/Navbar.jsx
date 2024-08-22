import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFetch } from "../hooks/useFetch";

const Navbar = ({ hideAuth }) => {
  const [user, setUser] = useState(null);
  const { data, isLoading, error } = useFetch(
    `${import.meta.env.VITE_API_URL}/users/user/me`
  );
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
      {data ? <p onClick={handleLogout}>{data.username}</p> : null}
    </ul>
  );
};

export default Navbar;
