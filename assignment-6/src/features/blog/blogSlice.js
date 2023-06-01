import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBlogDetails } from "features/blog/blogAPI";
import { updateBlog } from "features/blogs/blogsAPI";
import { isBoolean } from "lodash";

// initial state
const initialState = {
  isLoading: false,
  blogDetails: {},
  isError: false,
  isUpdating: false,
  error: "",
};

// async thunk
export const fetchBlogDetails = createAsyncThunk(
  "blog/getBlogDetails",
  async (blogId) => {
    const blog = await getBlogDetails(blogId);
    return blog;
  }
);

export const mutationBlog = createAsyncThunk(
  "blog/mutationBlog",
  async ({ id, mutationData }) => {
    const blog = await updateBlog({ id, mutationData });
    return blog;
  }
);

// slice
const blogSlice = createSlice({
  name: "blog",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(fetchBlogDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogDetails = action.payload;
      })
      .addCase(fetchBlogDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.blogDetails = {};
        state.isError = true;
        state.error = action?.error?.message;
      });

    // update blog
    builder
      .addCase(mutationBlog.pending, (state) => {
        state.isUpdating = true;
        state.error = "";
      })
      .addCase(mutationBlog.fulfilled, (state, action) => {
        const { likes: updatedLikes, isSaved: updatedSave } =
          action.payload || {};
        const { likes, isSaved } = state.blogDetails;

        state.isUpdating = false;
        state.blogDetails.likes = updatedLikes || likes;
        state.blogDetails.isSaved = isBoolean(updatedSave)
          ? updatedSave
          : isSaved;
      })
      .addCase(mutationBlog.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action?.error?.message;
      });
  },
});

export default blogSlice.reducer;
