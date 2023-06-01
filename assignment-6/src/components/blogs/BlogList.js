import React from "react";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import { useDispatch } from "react-redux";
import { mutationBlog } from "features/blogs/blogsSlice";
import { getTagsText } from "utils/AppHelpers";
import { size } from "lodash";

const BlogList = ({ blog, isUpdating }) => {
  const { id, title, image, createdAt, likes, isSaved, tags } = blog || {};

  // dispatch
  const dispatch = useDispatch();

  return (
    <div className="lws-card">
      <Link to={`post/${id}`}>
        <img src={image} className="lws-card-image" alt="" />
      </Link>
      <div className="p-4">
        <div className="lws-card-header">
          <p className="lws-publishedDate">
            {createdAt && moment(createdAt)?.format("YYYY-MM-DD")}
          </p>
          <button
            disabled={isUpdating}
            className="lws-likeCount"
            onClick={() =>
              dispatch(mutationBlog({ id, mutationData: { likes: likes + 1 } }))
            }
          >
            <i className="fa-regular fa-thumbs-up"></i>
            {likes}
          </button>
        </div>
        <Link to={`post/${id}`} className="lws-postTitle">
          {title}
        </Link>
        {size(tags) ? (
          <div className="lws-tags flex flex-wrap justify-start">
            {getTagsText(tags)}
          </div>
        ) : (
          ""
        )}
        {/* Show this element if post is saved */}
        {isSaved && (
          <div className="flex gap-2 mt-4">
            <span className="lws-badge"> Saved </span>
          </div>
        )}
        {/* Show this element if post is saved Ends */}
      </div>
    </div>
  );
};

export default BlogList;
