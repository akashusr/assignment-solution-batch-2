import { loadedBook } from "../BookStore/actions";

const fetchBooks = async (dispatch) => {
   try{
    const response = await fetch("http://localhost:9000/books");
    const books = await response.json();

    dispatch(loadedBook(books));
   }
   catch(err){console.log(err)}
};

export default fetchBooks;