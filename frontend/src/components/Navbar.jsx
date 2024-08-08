import { Link } from "react-router-dom";

const Navbar = ({ hideAuth }) => {
  return (
    <ul className="flex justify-between p-4 bg-black text-white">
      <li>
        <Link to="/home">Guessify</Link>
      </li>
      {hideAuth ? null : (
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
