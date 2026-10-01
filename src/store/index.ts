
import { configureStore } from "@reduxjs/toolkit";
import ticketsReducer from "./tickets-slice";

export const store = configureStore({
  reducer: {
    tickets: ticketsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;