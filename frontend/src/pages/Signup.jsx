import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const SignUpForm = () => {
  const [signUp, setSignUp] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleFieldChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSignUp({
      ...signUp,
      [name]: value,
    });
  };

  return (
    <form className="flex flex-col gap-6 mt-4 w-full">
      <div className="flex items-center gap-2 relative group/email">
        <input
          id="email"
          name="email"
          className="border px-2 py-3 rounded-md flex-1 text-md border-black focus:outline-green-500"
          type="email"
          onChange={handleFieldChange}
        />
        <label
          htmlFor="email"
          className={`absolute left-2 transition-all px-2 text-md bg-white group-focus-within/email:-translate-y-6 group-focus-within/email:text-green-500 ${
            signUp.email !== "" ? "-translate-y-6 text-black" : ""
          }`}
        >
          Email
        </label>
      </div>
      <div className="flex items-center gap-2 relative group/username">
        <input
          id="username"
          name="username"
          className="border px-2 py-3 rounded-md flex-1 text-md border-black focus:outline-green-500"
          type="text"
          onChange={handleFieldChange}
        />
        <label
          htmlFor="username"
          className={`absolute left-2 transition-all px-2 text-md bg-white group-focus-within/username:-translate-y-6 group-focus-within/username:text-green-500 ${
            signUp.username !== "" ? "-translate-y-6 text-black" : ""
          }`}
        >
          Username
        </label>
      </div>
      <div className="flex items-center gap-2 relative group/password">
        <input
          id="password"
          name="password"
          className="border px-2 py-3 rounded-md flex-1 text-md border-black focus:outline-green-500"
          type="password"
          onChange={handleFieldChange}
        />
        <label
          htmlFor="password"
          className={`absolute left-2 transition-all px-2 text-md bg-white group-focus-within/password:-translate-y-6 group-focus-within/password:text-green-500 ${
            signUp.password !== "" ? "-translate-y-6 text-black" : ""
          }`}
        >
          Password
        </label>
      </div>
      <div className="flex items-center gap-2 relative group/confirmPassword">
        <input
          id="confirmPassword"
          name="confirmPassword"
          className="border px-2 py-3 rounded-md flex-1 text-md border-black focus:outline-green-500"
          type="password"
          onChange={handleFieldChange}
        />
        <label
          htmlFor="confirmPassword"
          className={`absolute left-2 transition-all px-2 text-md bg-white group-focus-within/confirmPassword:-translate-y-6 group-focus-within/confirmPassword:text-green-500 ${
            signUp.confirmPassword !== "" ? "-translate-y-6 text-black" : ""
          }`}
        >
          Confirm Password
        </label>
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
