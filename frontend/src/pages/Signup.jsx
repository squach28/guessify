import React from "react";
import Navbar from "../components/Navbar";

const SignUpForm = () => {
  return (
    <form className="flex flex-col items-center justify-center gap-6 mt-4">
      <div className="flex items-center gap-2 w-[90%]">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          className="border p-1 rounded-md flex-1"
          type="email"
        />
      </div>
      <div className="flex items-center gap-2 w-[90%]">
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          className="border p-1 rounded-md flex-1"
          type="text"
        />
      </div>
      <div className="flex items-center gap-2 w-[90%]">
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          className="border p-1 rounded-md flex-1"
          type="password"
        />
      </div>
      <div className="flex items-center gap-2 w-[90%]">
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          className="border p-1 rounded-md flex-1"
          type="password"
        />
      </div>
      <button className="bg-black text-white w-[90%] px-1 py-2 rounded-lg">
        Sign Up
      </button>
    </form>
  );
};

const Signup = () => {
  return (
    <div>
      <Navbar hideAuth={true} />
      <SignUpForm />
    </div>
  );
};

export default Signup;
