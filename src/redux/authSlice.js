// app/redux/features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

var userSession = "";
if (typeof window !== 'undefined') {
  userSession = window.localStorage.getItem("happypaw_admin_user_session");
}

userSession = userSession?JSON.parse(userSession):null;

const initialState = {
  user: userSession,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserSession: (state, action) => {
      console.log("setUserSession: ", action.payload);
      state.user = action.payload;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem("happypaw_admin_user_session",JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      window.localStorage.removeItem("happypaw_admin_user_session");
    },
  },
});

export const { setUserSession, logout } = authSlice.actions;
export default authSlice.reducer;
