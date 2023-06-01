import { configureStore } from "@reduxjs/toolkit";
import blogDetailsReducer from "features/blog/blogSlice";
import blogsReducer from "features/blogs/blogsSlice";
import filtersReducer from "features/filters/filtersSlice";
import relatedBlogsReducer from "features/relatedBlogs/relatedBlogsSlice";

export const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    blogDetails: blogDetailsReducer,
    relatedBlogs: relatedBlogsReducer,
    filters: filtersReducer,
  },
});
