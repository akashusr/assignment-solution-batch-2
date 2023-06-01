import React from "react";
import { useDispatch } from "react-redux";
import { mutationBlog } from "features/blog/blogSlice";
import { getTagsText } from "utils/AppHelpers";
import { size } from "lodash";

const BlogDescriptions = ({ isLoading, blogDetails, isUpdating }) => {
  const { id, title, description, image, likes, isSaved, tags } =
    blogDetails || {};
  const dispatch = useDispatch();

  return (
    <main className="post">
      {(() => {
        if (isLoading) {
          return <p>Loading...</p>;
        }
        if (id) {
          return (
            <>
              <img
                src={image || ""}
                alt="githum"
                className="w-full rounded-md"
                id="lws-megaThumb"
              />
              <div>
                <h1 className="mt-6 text-2xl post-title" id="lws-singleTitle">
                  {title}
                </h1>
                {size(tags) ? (
                  <div className="tags" id="lws-singleTags">
                    {getTagsText(tags)}
                  </div>
                ) : (
                  ""
                )}

                <div className="btn-group">
                  {/* handle like on button click */}
                  <button
                    disabled={isUpdating}
                    className="like-btn"
                    id="lws-singleLinks"
                    onClick={() =>
                      dispatch(
                        mutationBlog({
                          id,
                          mutationData: { likes: likes + 1 },
                        })
                      )
                    }
                  >
                    <i className="fa-regular fa-thumbs-up"></i>
                    {likes}
                  </button>

                  {/* handle save on button click */}
                  {/* use ".active" class and "Saved" text  if a post is saved, other wise "Save" */}
                  <button
                    className={`${isSaved && "active"} save-btn`}
                    id="lws-singleSavedBtn"
                    disabled={isUpdating}
                    onClick={() =>
                      dispatch(
                        mutationBlog({
                          id,
                          mutationData: { isSaved: !isSaved },
                        })
                      )
                    }
                  >
                    <i className="fa-regular fa-bookmark"></i>{" "}
                    {isSaved ? "Saved" : "Save"}
                  </button>
                </div>
                <div className="mt-6">
                  <p>{description}</p>
                </div>
              </div>
            </>
          );
        }
        return <p>We did not find anything to show here</p>;
      })()}
    </main>
  );
};

export default BlogDescriptions;
