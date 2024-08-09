export const signUpReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_ACCOUNT": {
      const fieldName = action.payload.name;
      const fieldValue = action.payload.value;
      return {
        ...state,
        account: {
          ...state.account,
          [fieldName]: fieldValue,
        },
      };
    }

    case "EMPTY_FIELD": {
      const fieldName = action.payload.name;
      const error =
        fieldName === "confirmPassword"
          ? "Confirm Password cannot be empty"
          : `${
              fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
            } cannot be empty`;
      return {
        ...state,
        errors: {
          ...state.errors,
          [fieldName]: error,
        },
      };
    }

    case "INVALID_EMAIL":
      return {
        ...state,
        errors: {
          ...state.errors,
          email: "Email is invalid",
        },
      };
    case "EMAIL_ALREADY_TAKEN":
      return {
        ...state,
        errors: {
          ...state.errors,
          email: "Email is already taken",
        },
      };

    case "USERNAME_ALREADY_TAKEN":
      return {
        ...state,
        errors: {
          ...state.errors,
          username: "Username is already taken",
        },
      };
    case "MISMATCHING_PASSWORDS":
      return {
        ...state,
        errors: {
          ...state.errors,
          confirmPassword: `Passwords don't match`,
        },
      };
    case "CLEAR_ERROR":
      const name = action.payload.name;
      return {
        ...state,
        errors: {
          ...state.errors,
          [name]: "",
        },
      };

    default:
      throw new Error();
  }
};
