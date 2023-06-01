import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  status: "all",
  sort: "default",
};

// slice
const filtersSlice = createSlice({
  name: "relatedBlogs",
  initialState,
  reducers: {
    statusSelected: (state, action) => {
      state.status = action.payload;
    },
    sortChanged: (state, action) => {
      state.sort = action.payload;
    },
  },
});

export const { statusSelected, sortChanged } = filtersSlice.actions;

export default filtersSlice.reducer;
