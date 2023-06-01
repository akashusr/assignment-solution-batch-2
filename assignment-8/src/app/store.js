import { configureStore } from "@reduxjs/toolkit";
import { bookApi } from "features/api/bookApi";
import booksReducer from "features/books/booksSlice";

export const store = configureStore({
  reducer: {
    [bookApi.reducerPath]: bookApi.reducer,
    booksFilterInfo: booksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(bookApi.middleware),
});
