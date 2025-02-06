import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
  uid: null,
  subscriptionStatus: "Basic", // Add subscriptionStatus to the initial state
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.uid = action.payload.uid;
    },
    signOutUser: (state) => {
      state.email = null;
      state.uid = null;
      state.subscriptionStatus = "Basic"; // Reset subscriptionStatus on sign out
    },
    setSubscriptionStatus: (state, action) => {
      state.subscriptionStatus = action.payload;
    },
  },
});

export const { setUser, signOutUser, setSubscriptionStatus } = userSlice.actions;

export default userSlice.reducer;