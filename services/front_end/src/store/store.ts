import { configureStore } from "@reduxjs/toolkit";
import { events } from "./api/events";

export const store = configureStore({
  reducer: {
    [events.reducerPath]: events.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(events.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
