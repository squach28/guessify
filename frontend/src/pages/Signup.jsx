import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const SignUpForm = () => {
  return (
    <form className="flex flex-col gap-6 mt-4 w-full">
      <div className="flex items-center gap-2">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          className="border p-1 rounded-md flex-1"
          type="email"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          className="border p-1 rounded-md flex-1"
          type="text"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          className="border p-1 rounded-md flex-1"
          type="password"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          className="border p-1 rounded-md flex-1"
          type="password"
        />
      </div>
      <button className="bg-black text-white px-1 py-2 rounded-lg">
        Sign Up
      </button>
    </form>
  );
};

const Signup = () => {
  return (
    <div className="w-full">
      <Navbar hideAuth={true} />
      <div className="flex flex-col p-6 md:max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <SignUpForm />
        <p className="mx-auto text-center m-2">
          Already have an account?{" "}
          <Link className="underline" to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
