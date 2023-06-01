import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "features/api/apiSlice";
import filtersReducer from "features/filters/filtersSlice";
import taskReducer from "features/tasks/taskSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    filters: filtersReducer,
    tasks: taskReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
