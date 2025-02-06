import { createSlice } from '@reduxjs/toolkit';

const initialState = 'none';

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscriptionNone: (state) => 'none',
    setSubscriptionBasic: (state) => 'Basic',
    setSubscriptionMonthly: (state) => 'Premium',
    setSubscriptionYearly: (state) => 'Premium Plus',
  },
});

export const {
  setSubscriptionNone,
  setSubscriptionBasic,
  setSubscriptionMonthly,
  setSubscriptionYearly,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;