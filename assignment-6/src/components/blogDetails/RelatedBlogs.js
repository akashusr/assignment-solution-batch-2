import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRelatedBlogs } from "features/relatedBlogs/relatedBlogsSlice";
import { size } from "lodash";
import moment from "moment";
import { getTagsText } from "utils/AppHelpers";

const RelatedBlogs = ({ tags, id }) => {
  const dispatch = useDispatch();
  const { isLoading, relatedBlogs } = useSelector(
    (state) => state.relatedBlogs
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchRelatedBlogs({ tags, id }));
    }
  }, [dispatch, tags, id]);

  return (
    <aside>
      <h4 className="mb-4 text-xl font-medium" id="lws-relatedPosts">
        Related Posts
      </h4>
      <div className="space-y-4 related-post-container">
        {(() => {
          if (isLoading) {
            return <p>Loading...</p>;
          }
          if (size(relatedBlogs)) {
            return relatedBlogs?.map((blog) => {
              const { id, title, image, tags, createdAt } = blog;
              return (
                <div key={id} className="card">
                  <Link to={`/post/${id}`}>
                    <img src={image} className="card-image" alt="" />
                  </Link>
                  <div className="p-4">
                    <Link
                      to={`/post/${id}`}
                      className="text-lg post-title lws-RelatedPostTitle"
                    >
                      {title}
                    </Link>
                    {size(tags) ? (
                      <div className="mb-0 tags">{getTagsText(tags)}</div>
                    ) : (
                      ""
                    )}
                    <p>{createdAt && moment(createdAt).format("YYYY-MM-DD")}</p>
                  </div>
                </div>
              );
            });
          }
          return <p>We did not find anything to show here</p>;
        })()}
      </div>
    </aside>
  );
};

export default RelatedBlogs;
