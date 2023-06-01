import React, { useRef, useState } from "react";
import { toastAlert } from "components/utils/AppHelpers";
import { useAddBookMutation } from "features/api/bookApi";
import { size } from "lodash";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddBook = () => {
  const [addBook, { isLoading }] = useAddBookMutation();
  const [mutationData, setMutationData] = useState({});
  const navigate = useNavigate();
  const formRef = useRef(null);
  const toastId = useRef(null);

  const handleChange = (name, value) => {
    setMutationData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    toast.dismiss(toastId.current);

    const updatedData = { ...mutationData, featured: !!mutationData?.featured };

    if (size(updatedData)) {
      addBook(updatedData)
        .unwrap()
        .then((payload) => {
          if (size(payload)) {
            toastAlert("success", "Book added successfully!");
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
          <h4 className="mb-8 text-xl font-bold text-center">Add New Book</h4>
          <form ref={formRef} onSubmit={handleAddBook} className="book-form">
            <div className="space-y-2">
              <label htmlFor="lws-bookName">Book Name</label>
              <input
                required
                className="text-input"
                type="text"
                id="lws-bookName"
                name="name"
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
              {isLoading ? "Applying..." : "Add Book"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddBook;
