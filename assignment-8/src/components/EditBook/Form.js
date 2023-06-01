import React, { useRef, useState } from "react";
import { toastAlert } from "components/utils/AppHelpers";
import { useUpdateBookMutation } from "features/api/bookApi";
import { size } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Form = ({ initialBookInfo }) => {
  const { id } = useParams();
  const [updateBook, { isLoading }] = useUpdateBookMutation();
  const [mutationData, setMutationData] = useState(initialBookInfo);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const toastId = useRef(null);

  const handleChange = (name, value) => {
    setMutationData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateBook = (e) => {
    e.preventDefault();
    toast.dismiss(toastId.current);

    const updatedData = { ...mutationData, featured: !!mutationData?.featured };

    if (size(updatedData)) {
      updateBook({ id, data: updatedData })
        .unwrap()
        .then((payload) => {
          if (size(payload)) {
            toastAlert("success", "Updated successfully!");
            formRef.current.reset();
            setMutationData({});
            navigate("/");
          }
        })
        .catch((error) =>
          toastAlert(
            "error",
            error?.error || "Something went wrong! Please try again later."
          )
        );
    }
  };

  return (
    <main className="py-6 2xl:px-6">
      <div className="container">
        <div className="p-8 overflow-hidden bg-white shadow-cardShadow rounded-md max-w-xl mx-auto">
          <h4 className="mb-8 text-xl font-bold text-center">Edit Book</h4>
          <form ref={formRef} onSubmit={handleUpdateBook} className="book-form">
            <div className="space-y-2">
              <label htmlFor="lws-bookName">Book Name</label>
              <input
                required
                className="text-input"
                type="text"
                id="lws-bookName"
                name="name"
                defaultValue={mutationData?.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lws-author">Author</label>
              <input
                required
                className="text-input"
                type="text"
                id="lws-author"
                name="author"
                defaultValue={mutationData?.author}
                onChange={(e) => handleChange("author", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lws-thumbnail">Image Url</label>
              <input
                required
                className="text-input"
                type="url"
                id="lws-thumbnail"
                name="thumbnail"
                defaultValue={mutationData?.thumbnail}
                onChange={(e) => handleChange("thumbnail", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-8 pb-4">
              <div className="space-y-2">
                <label htmlFor="lws-price">Price</label>
                <input
                  required
                  className="text-input"
                  type="number"
                  id="lws-price"
                  name="price"
                  min="0"
                  step="any"
                  defaultValue={mutationData?.price}
                  onChange={(e) =>
                    handleChange("price", parseFloat(e.target.value) || 0)
                  }
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lws-rating">Rating</label>
                <input
                  required
                  className="text-input"
                  type="number"
                  id="lws-rating"
                  name="rating"
                  min="1"
                  max="5"
                  defaultValue={mutationData?.rating}
                  onChange={(e) =>
                    handleChange("rating", parseInt(e.target.value) || 0)
                  }
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="lws-featured"
                type="checkbox"
                name="featured"
                className="w-4 h-4"
                checked={mutationData?.featured || false}
                onChange={(e) => handleChange("featured", e.target.checked)}
              />
              <label htmlFor="lws-featured" className="ml-2 text-sm">
                This is a featured book
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="submit"
              id="lws-submit"
            >
              {isLoading ? "Updating..." : "Edit Book"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Form;
