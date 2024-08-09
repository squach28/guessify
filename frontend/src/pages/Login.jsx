import React, { useReducer, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { logInReducer } from "../reducers/logInReducer";
import validator from "validator";

const LoginForm = () => {
  const [logIn, dispatchLogIn] = useReducer(logInReducer, {
    account: {
      username: "",
      password: "",
    },
    errors: {
      username: "",
      password: "",
    },
  });

  const hasErrors = () => {
    for (const [_, value] of Object.entries(logIn.errors)) {
      if (!validator.isEmpty(value)) {
        return true;
      }
    }
  };

  const hasEmptyFields = () => {
    for (const [_, value] of Object.entries(logIn.account)) {
      if (validator.isEmpty(value)) {
        return true;
      }
    }
    return false;
  };

  const handleFieldChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (validator.isEmpty(value)) {
      dispatchLogIn({
        type: "EMPTY_FIELD",
        payload: {
          name,
        },
      });
    } else {
      dispatchLogIn({
        type: "CLEAR_ERROR",
        payload: {
          name,
        },
      });
    }
    dispatchLogIn({
      type: "UPDATE_ACCOUNT",
      payload: {
        name,
        value,
      },
    });
  };

  const handleFieldBlur = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (validator.isEmpty(value)) {
      dispatchLogIn({
        type: "EMPTY_FIELD",
        payload: { name },
      });
    } else {
      dispatchLogIn({
        type: "CLEAR_ERROR",
        payload: { name },
      });
    }
  };

  return (
    <form className="flex flex-col gap-4 mt-4 w-full">
      <div className="flex items-center gap-2 relative group/username">
        <input
          id="username"
          name="username"
          className={`border px-2 py-3 rounded-md flex-1 text-md border-black focus:shadow-md focus:outline-black ${
            logIn.errors.username !== ""
              ? "border-red-500 focus:outline-red-500"
              : ""
          }`}
          type="text"
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />
        <label
          htmlFor="username"
          className={`absolute left-2 transition-all px-2 text-md bg-white group-focus-within/username:-translate-y-6 ${
            logIn.account.username !== "" ? "-translate-y-6 text-black" : ""
          } ${logIn.errors.username !== "" ? "text-red-500" : ""}`}
        >
          Username
        </label>
      </div>
      {logIn.errors.username ? (
        <p className="text-sm text-red-500 -mt-3">{logIn.errors.username}</p>
      ) : null}
      <div className="flex items-center gap-2 relative group/password">
        <input
          id="password"
          name="password"
          className={`border px-2 py-3 rounded-md flex-1 text-md border-black focus:shadow-md focus:outline-black ${
            logIn.errors.password !== ""
              ? "border-red-500 focus:outline-red-500"
              : ""
          }`}
          type="password"
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />
        <label
          htmlFor="password"
          className={`absolute left-2 transition-all px-2 text-md bg-white group-focus-within/password:-translate-y-6 ${
            logIn.account.password !== "" ? "-translate-y-6 text-black" : ""
          } ${logIn.errors.password !== "" ? "text-red-500" : ""}`}
        >
          Password
        </label>
      </div>
      {logIn.errors.password ? (
        <p className="text-sm text-red-500 -mt-3">{logIn.errors.password}</p>
      ) : null}
      <button
        className="bg-black text-white px-1 py-2 rounded-lg disabled:bg-slate-300 disabled:text-black"
        disabled={hasErrors() || hasEmptyFields()}
      >
        Log in
      </button>
    </form>
  );
};

const Login = () => {
  return (
    <div>
      <Navbar hideAuth={true} />
      <div className="flex flex-col p-6 md:max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">Log In</h1>
        <LoginForm />
        <p className="mx-auto text-center m-2">
          Don't have an account?{" "}
          <Link className="underline" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
