import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

// Define a type for the slice state
export interface AuthenticateState {
  isLogin: boolean;
  role: "Admin" | "User" | "";
  location: string;
}

// Define the initial state using that type
const initialState: AuthenticateState = {
  isLogin: false,
  role: "",
  location: "",
};

export const AuthenticateSlice = createSlice({
  name: "authenticate",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIsLogin(state, action: PayloadAction<boolean>) {
      state.isLogin = action.payload;
    },
    setRole(state, action: PayloadAction<"Admin" | "User" | "">) {
      state.role = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
  },
});

export const { setIsLogin, setRole, setLocation } = AuthenticateSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectIsLogin = (state: RootState) => state.authenticate.isLogin;
export const selectRole = (state: RootState) => state.authenticate.role;
export const selectLocation = (state: RootState) => state.authenticate.location;

export default AuthenticateSlice.reducer;
