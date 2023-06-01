import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogDetails } from "features/blog/blogSlice";
import { useParams } from "react-router-dom";
import BlogDescriptions from "components/blogDetails/BlogDescriptions";
import RelatedBlogs from "components/blogDetails/RelatedBlogs";
import { Link } from "react-router-dom";

const BlogDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // state
  const { isLoading, blogDetails, isUpdating } = useSelector(
    (state) => state.blogDetails
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogDetails(id));
    }
  }, [dispatch, id]);

  return (
    <>
      {/* Go Home / Go Back */}
      <div className="container mt-8">
        <Link
          to="/"
          className="inline-block text-gray-600 home-btn"
          id="lws-goHome"
        >
          <i className="mr-2 fa-solid fa-house"></i>Go Home
        </Link>
      </div>

      <section className="post-page-container">
        {/* detailed post  */}
        <BlogDescriptions
          isLoading={isLoading}
          blogDetails={blogDetails}
          isUpdating={isUpdating}
        />

        {/* related posts */}
        <RelatedBlogs tags={blogDetails?.tags} id={blogDetails?.id} />
      </section>
    </>
  );
};

export default BlogDetails;
