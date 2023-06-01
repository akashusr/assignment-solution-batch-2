import React, { useEffect } from "react";
import { fetchBlogs } from "features/blogs/blogsSlice";
import { size } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import BlogList from "./BlogList";

const Blogs = () => {
  const { isLoading, blogs, isUpdating } = useSelector((state) => state.blogs);
  const { status, sort } = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const filteredByStatus = (blog) => {
    if (status === "saved") {
      return blog?.isSaved;
    }
    return true;
  };

  const sortedBlogs = (a, b) => {
    if (sort === "newest") {
      return new Date(b?.createdAt) - new Date(a?.createdAt);
    }
    if (sort === "most_liked") {
      return b?.likes - a?.likes;
    }
    return 0;
  };

  return (
    <main className="post-container" id="lws-postContainer">
      {(() => {
        if (isLoading) {
          return <p>Loading...</p>;
        }
        if (size(blogs)) {
          return blogs
            ?.slice()
            ?.sort(sortedBlogs)
            ?.filter(filteredByStatus)
            ?.map((blog) => (
              <BlogList key={blog?.id} blog={blog} isUpdating={isUpdating} />
            ));
        }
        return <p>We did not find anything to show here</p>;
      })()}
    </main>
  );
};

export default Blogs;
