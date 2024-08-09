import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Navbar = ({ hideAuth }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/user/me`, {
        withCredentials: true,
      })
      .then((res) => setUser(res.data))
      .catch((e) => setUser(null));
  }, []);
  return (
    <ul className="flex justify-between p-4 bg-black text-white">
      <li>
        <Link to="/home">Guessify</Link>
      </li>
      {hideAuth ? null : user ? (
        <p>{user.username}</p>
      ) : (
        <div className="flex items-center gap-4">
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
          <li>
            <Link to="/login">Log in</Link>
          </li>
        </div>
      )}
    </ul>
  );
};

export default Navbar;
