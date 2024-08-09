import React, { useReducer, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import validator from "validator";
import axios from "axios";
import { signUpReducer } from "../reducers/signUpReducer";

const SignUpForm = () => {
  const [signUp, dispatchSignUp] = useReducer(signUpReducer, {
    account: { email: "", username: "", password: "", confirmPassword: "" },
    errors: { email: "", username: "", password: "", confirmPassword: "" },
  });
  const [signUpResult, setSignUpResult] = useState({
    isLoading: false,
    hasError: false,
    data: null,
  });

  const hasErrors = () => {
    for (const [_, value] of Object.entries(signUp.errors)) {
      if (!validator.isEmpty(value)) {
        return true;
      }
    }
  };

  const hasEmptyFields = () => {
    for (const [_, value] of Object.entries(signUp.account)) {
      if (validator.isEmpty(value)) {
        return true;
      }
    }
    return false;
  };

  const handleFieldChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatchSignUp({
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
      dispatchSignUp({
        type: "EMPTY_FIELD",
        payload: {
          name,
        },
      });
      return;
    } else {
      dispatchSignUp({
        type: "CLEAR_ERROR",
        payload: {
          name,
        },
      });
    }
    if (name === "email") {
      if (!validator.isEmail(value)) {
        dispatchSignUp({
          type: "INVALID_EMAIL",
        });
        return;
      }

      axios
        .get(`${import.meta.env.VITE_API_URL}/users?email=${value}`)
        .then(() =>
          dispatchSignUp({
            type: "EMAIL_ALREADY_TAKEN",
          })
        )
        .catch(() =>
          dispatchSignUp({
            type: "CLEAR_ERROR",
            payload: {
              name,
            },
          })
        );
      return;
    }

    if (name === "username") {
      axios
        .get(`${import.meta.env.VITE_API_URL}/users?username=${value}`)
        .then(() =>
          dispatchSignUp({
            type: "USERNAME_ALREADY_TAKEN",
          })
        )
        .catch(() =>
          dispatchSignUp({
            type: "CLEAR_ERROR",
            payload: {
              name,
            },
          })
        );
      return;
    }

    if (name === "confirmPassword") {
      if (signUp.account.password !== value) {
        dispatchSignUp({
          type: "MISMATCHING_PASSWORDS",
        });
      } else {
        dispatchSignUp({
          type: "CLEAR_ERROR",
          payload: {
            name,
          },
        });
      }
    }
  };

  const registerUser = async (user) => {
    setSignUpResult({
      ...signUpResult,
      isLoading: true,
    });
    return axios
      .post(`${import.meta.env.VITE_API_URL}/auth/signup`, user)
      .then((res) =>
        setSignUpResult({
          ...signUpResult,
          isLoading: false,
          data: res.data,
        })
      )
      .catch((e) =>
        setSignUpResult({
          ...signUpResult,
          isLoading: false,
          hasError: true,
        })
      );
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const user = signUp.account;
    registerUser(user).then((res) => {
      console.log(res);
      if (res) {
      } else {
      }
    });
  };

  return (
    <form className="flex flex-col gap-4 mt-4 w-full" onSubmit={handleSignUp}>
      <div className="flex items-center gap-2 relative group/email">
        <input
          id="email"
          name="email"
          className={`border px-2 py-3 rounded-md flex-1 text-md border-black focus:shadow-md focus:outline-black ${
            signUp.errors.email !== ""
              ? "border-red-500 focus:outline-red-500"
              : ""
          }`}
          type="email"
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />
        <label
          htmlFor="email"
          className={`absolute left-2 transition-all px-2 text-md bg-white group-focus-within/email:-translate-y-6 ${
            signUp.account.email !== "" ? "-translate-y-6 text-black" : ""
          } ${signUp.errors.email !== "" ? "text-red-500" : ""}`}
        >
          Email*
        </label>
      </div>
      {signUp.errors.email ? (
        <p className="text-sm text-red-500 -mt-3">{signUp.errors.email}</p>
      ) : null}
      <div className="flex items-center gap-2 relative group/username">
        <input
          id="username"
          name="username"
          className={`border px-2 py-3 rounded-md flex-1 text-md border-black focus:shadow-md focus:outline-black ${
            signUp.errors.username !== ""
              ? "border-red-500 focus:outline-red-500"
              : ""
          }`}
          type="text"
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />
        <label
          htmlFor="username"
          className={`absolute left-2 transition-all px-2 text-md bg-white group-focus-within/username:-translate-y-6  ${
            signUp.account.username !== "" ? "-translate-y-6 text-black" : ""
          } ${
            signUp.errors.username !== ""
              ? "text-red-500 focus:outline-red-500"
              : ""
          }`}
        >
          Username*
        </label>
      </div>
      {signUp.errors.username ? (
        <p className="text-sm text-red-500 -mt-3">{signUp.errors.username}</p>
      ) : null}
      <div className="flex items-center gap-2 relative group/password">
        <input
          id="password"
          name="password"
          className={`border px-2 py-3 rounded-md flex-1 text-md border-black focus:shadow-md focus:outline-black ${
            signUp.errors.password !== ""
              ? "border-red-500 focus:outline-red-500"
              : ""
          }`}
          type="password"
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />
        <label
          htmlFor="password"
          className={`absolute left-2 transition-all px-2 text-md bg-white group-focus-within/password:-translate-y-6  ${
            signUp.account.password !== "" ? "-translate-y-6 text-black" : ""
          } ${signUp.errors.password !== "" ? "text-red-500" : ""}`}
        >
          Password*
        </label>
      </div>
      {signUp.errors.password ? (
        <p className="text-sm text-red-500 -mt-3">{signUp.errors.password}</p>
      ) : null}
      <div className="flex items-center gap-2 relative group/confirmPassword">
        <input
          id="confirmPassword"
          name="confirmPassword"
          className={`border px-2 py-3 rounded-md flex-1 text-md border-black focus:shadow-md focus:outline-black ${
            signUp.errors.confirmPassword !== ""
              ? "border-red-500 focus:outline-red-500"
              : ""
          }`}
          type="password"
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />
        <label
          htmlFor="confirmPassword"
          className={`absolute left-2 transition-all px-2 text-md bg-white group-focus-within/confirmPassword:-translate-y-6  ${
            signUp.account.confirmPassword !== ""
              ? "-translate-y-6 text-black"
              : ""
          } ${signUp.errors.confirmPassword !== "" ? "text-red-500" : ""}`}
        >
          Confirm Password*
        </label>
      </div>
      {signUp.errors.confirmPassword ? (
        <p className="text-sm text-red-500 -mt-3">
          {signUp.errors.confirmPassword}
        </p>
      ) : null}
      <button
        className="bg-black text-white px-1 py-2 rounded-lg disabled:bg-slate-300 disabled:text-black"
        disabled={hasEmptyFields() || hasErrors()}
      >
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
