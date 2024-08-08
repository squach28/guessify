import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import validator from "validator";

const SignUpForm = () => {
  const [signUp, setSignUp] = useState({
    account: { email: "", username: "", password: "", confirmPassword: "" },
    errors: { email: "", username: "", password: "", confirmPassword: "" },
  });

  const handleFieldChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSignUp({
      ...signUp,
      account: {
        ...signUp.account,
        [name]: value,
      },
    });
  };

  const handleFieldBlur = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    switch (field) {
      case "email":
        if (validator.isEmpty(value)) {
          setSignUp({
            ...signUp,
            errors: {
              ...signUp.errors,
              [field]: "Email cannot be empty",
            },
          });
        } else if (!validator.isEmail(value)) {
          setSignUp({
            ...signUp,
            errors: {
              ...signUp.errors,
              [field]: "Email is not valid",
            },
          });
        } else {
          setSignUp({
            ...signUp,
            errors: {
              ...signUp.errors,
              [field]: "",
            },
          });
        }
        break;
      case "username":
        if (validator.isEmpty(value)) {
          setSignUp({
            ...signUp,
            errors: {
              ...signUp.errors,
              [field]: "Username cannot be empty",
            },
          });
        } else {
          setSignUp({
            ...signUp,
            errors: {
              ...signUp.errors,
              [field]: "",
            },
          });
        }
        break;
      case "password":
        if (validator.isEmpty(value)) {
          setSignUp({
            ...signUp,
            errors: {
              ...signUp.errors,
              [field]: "Password cannot be empty",
            },
          });
        } else {
          setSignUp({
            ...signUp,
            errors: {
              ...signUp.errors,
              [field]: "",
            },
          });
        }
        break;
      case "confirmPassword":
        const password = signUp.password;
        if (validator.isEmpty(value)) {
          setSignUp({
            ...signUp,
            errors: {
              ...signUp.errors,
              [field]: "Confirm Password cannot be empty",
            },
          });
        } else if (password !== value) {
          setSignUp({
            ...signUp,
            errors: {
              ...signUp.errors,
              [field]: "Passwords don't match",
            },
          });
        } else {
          setSignUp({
            ...signUp,
            errors: {
              ...signUp.errors,
              [field]: "",
            },
          });
        }
        break;
      default:
        throw new Error();
    }
  };

  return (
    <form className="flex flex-col gap-4 mt-4 w-full">
      <div className="flex items-center gap-2 relative group/email">
        <input
          id="email"
          name="email"
          className={`border px-2 py-3 rounded-md flex-1 text-md border-black focus:outline-green-500 ${
            signUp.errors.email !== "" ? "border-red-500" : ""
          }`}
          type="email"
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />
        <label
          htmlFor="email"
          className={`absolute left-2 transition-all px-2 text-md bg-white group-focus-within/email:-translate-y-6 group-focus-within/email:text-green-500 ${
            signUp.account.email !== "" ? "-translate-y-6 text-black" : ""
          } ${signUp.errors.email !== "" ? "text-red-500" : ""}`}
        >
          Email
        </label>
      </div>
      {signUp.errors.email ? (
        <p className="text-sm text-red-500 -mt-3">{signUp.errors.email}</p>
      ) : null}
      <div className="flex items-center gap-2 relative group/username">
        <input
          id="username"
          name="username"
          className={`border px-2 py-3 rounded-md flex-1 text-md border-black focus:outline-green-500 ${
            signUp.errors.username !== "" ? "border-red-500" : ""
          }`}
          type="text"
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />
        <label
          htmlFor="username"
          className={`absolute left-2 transition-all px-2 text-md bg-white group-focus-within/username:-translate-y-6 group-focus-within/username:text-green-500 ${
            signUp.account.username !== "" ? "-translate-y-6 text-black" : ""
          }`}
        >
          Username
        </label>
      </div>
      {signUp.errors.username ? (
        <p className="text-sm text-red-500 -mt-3">{signUp.errors.username}</p>
      ) : null}
      <div className="flex items-center gap-2 relative group/password">
        <input
          id="password"
          name="password"
          className={`border px-2 py-3 rounded-md flex-1 text-md border-black focus:outline-green-500 ${
            signUp.errors.password !== "" ? "border-red-500" : ""
          }`}
          type="password"
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />
        <label
          htmlFor="password"
          className={`absolute left-2 transition-all px-2 text-md bg-white group-focus-within/password:-translate-y-6 group-focus-within/password:text-green-500 ${
            signUp.account.password !== "" ? "-translate-y-6 text-black" : ""
          }`}
        >
          Password
        </label>
      </div>
      {signUp.errors.password ? (
        <p className="text-sm text-red-500 -mt-3">{signUp.errors.password}</p>
      ) : null}
      <div className="flex items-center gap-2 relative group/confirmPassword">
        <input
          id="confirmPassword"
          name="confirmPassword"
          className={`border px-2 py-3 rounded-md flex-1 text-md border-black focus:outline-green-500 ${
            signUp.errors.confirmPassword !== "" ? "border-red-500" : ""
          }`}
          type="password"
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />
        <label
          htmlFor="confirmPassword"
          className={`absolute left-2 transition-all px-2 text-md bg-white group-focus-within/confirmPassword:-translate-y-6 group-focus-within/confirmPassword:text-green-500 ${
            signUp.account.confirmPassword !== ""
              ? "-translate-y-6 text-black"
              : ""
          }`}
        >
          Confirm Password
        </label>
      </div>
      {signUp.errors.confirmPassword ? (
        <p className="text-sm text-red-500 -mt-3">
          {signUp.errors.confirmPassword}
        </p>
      ) : null}
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
