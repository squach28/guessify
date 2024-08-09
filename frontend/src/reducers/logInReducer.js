export const logInReducer = (state, action) => {
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
      return {
        ...state,
        errors: {
          ...state.errors,
          [fieldName]: `${
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          } cannot be empty`,
        },
      };
    }

    case "USERNAME_DOES_NOT_EXIST":
      return {
        ...state,
        errors: {
          ...state.errors,
          username: "Username does not exist",
        },
      };

    case "WRONG_PASSWORD":
      return {
        ...state,
        errors: {
          ...state.errors,
          password: "Password is incorrect",
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
  }
};
