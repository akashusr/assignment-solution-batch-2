import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBlogs, updateBlog } from "features/blogs/blogsAPI";

// initial state
const initialState = {
  isLoading: false,
  blogs: [],
  isError: false,
  isUpdating: false,
  error: "",
};

// async thunks
export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  const blogs = await getBlogs();
  return blogs;
});

export const mutationBlog = createAsyncThunk(
  "blogs/mutationBlog",
  async ({ id, mutationData }) => {
    const blog = await updateBlog({ id, mutationData });
    return blog;
  }
);

// slice
const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.blogs = [];
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
        const updatedBlogs = state.blogs?.map((blog) => {
          if (blog?.id === action.payload?.id) {
            return { ...blog, likes: action.payload?.likes };
          }
          return blog;
        });

        state.isUpdating = false;
        state.blogs = updatedBlogs;
      })
      .addCase(mutationBlog.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action?.error?.message;
      });
  },
});

export default blogsSlice.reducer;
