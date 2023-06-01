import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRelatedBlogs } from "features/relatedBlogs/relatedAPI";

// initial state
const initialState = {
  isLoading: false,
  relatedBlogs: [],
  isError: false,
  error: "",
};

// async thunk
export const fetchRelatedBlogs = createAsyncThunk(
  "relatedBlogs/getRelatedBlogs",
  async ({ tags, id }) => {
    const relatedBlogs = await getRelatedBlogs({ tags, id });
    return relatedBlogs;
  }
);

// slice
const relatedBlogsSlice = createSlice({
  name: "relatedBlogs",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelatedBlogs.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(fetchRelatedBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.relatedBlogs = action.payload;
      })
      .addCase(fetchRelatedBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.relatedBlogs = [];
        state.isError = true;
        state.error = action?.error?.message;
      });
  },
});

export default relatedBlogsSlice.reducer;
