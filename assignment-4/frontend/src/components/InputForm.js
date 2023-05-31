import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import addBookThunk from "../redux/thunk/addBook";
import updateBookThunk from "../redux/thunk/updateBook";


export default function InputForm({ isUpdate, setIsUpdate }) {

  const dispatch = useDispatch()

  const [input, setInput] = useState({
    name: "",
    author: "",
    thumbnail: "",
    price: "",
    rating: "",
    featured: false,
  });

  useEffect(() => {
    if (isUpdate) {
      setInput(isUpdate)
    }
  }, [isUpdate])



  const submitHandler = (e) => {
    e.preventDefault();

    if (isUpdate) {
      dispatch(updateBookThunk(input))
      setIsUpdate(false);
    } else {
      dispatch(addBookThunk(input))
    }

    // form reset
    setInput({
      name: "",
      author: "",
      thumbnail: "",
      price: "",
      rating: "",
      featured: false,
    })
  }


  const inputHandler = (fieldName, e) => {
    switch(fieldName){
      case "price": 
      setInput({ ...input, [fieldName]: Number(e.target.value) })
      break;

      case "rating": 
      setInput({ ...input, [fieldName]: Number(e.target.value) })
      break;

      case "featured":
        setInput((prev) => {
          return { ...input, [fieldName]: !prev.featured }
        })
        break;

      default:
        setInput({ ...input, [fieldName]: e.target.value })
    }


  }

  return (
    <>
      <div>
        <div className="p-4 overflow-hidden bg-white shadow-cardShadow rounded-md">
          <h4 className="mb-8 text-xl font-bold text-center">Add New Book</h4>
          <form onSubmit={submitHandler} className="book-form">
            <div className="space-y-2">
              <label htmlFor="name">Book Name</label>
              <input required className="text-input" type="text" id="input-Bookname" name="name"
                value={input.name}
                onChange={(e) => inputHandler("name", e)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category">Author</label>
              <input required className="text-input" type="text" id="input-Bookauthor" name="author"
                value={input.author}
                onChange={(e) => inputHandler("author", e)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image">Image Url</label>
              <input required className="text-input" type="text" id="input-Bookthumbnail" name="thumbnail"
                value={input.thumbnail}
                onChange={(e) => inputHandler("thumbnail", e)}
              />
            </div>

            <div className="grid grid-cols-2 gap-8 pb-4">
              <div className="space-y-2">
                <label htmlFor="price">Price</label>
                <input required className="text-input" type="number" id="input-Bookprice" name="price"
                  value={input.price}
                  onChange={(e) => inputHandler("price", e)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="quantity">Rating</label>
                <input required className="text-input" type="number" id="input-Bookrating" name="rating" min="1" max="5"
                  value={input?.rating}
                  onChange={(e) => inputHandler("rating", e)}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input id="input-Bookfeatured" type="checkbox" name="featured" className="w-4 h-4"
                checked={input.featured}
                value={input.featured}
                onChange={(e) => inputHandler("featured", e)}
              />
              <label htmlFor="featured" className="ml-2 text-sm"> This is a featured book </label>
            </div>

            <button type="submit" className="submit" id="submit">{isUpdate ? "Update Book" : "Add Book"}</button>
          </form>
        </div>
      </div>
    </>
  )
};