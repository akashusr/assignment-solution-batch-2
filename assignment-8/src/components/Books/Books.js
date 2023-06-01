import React from "react";
import { useGetBooksQuery } from "features/api/bookApi";
import { size } from "lodash";
import Book from "components/Books/Book";
import warningMessage from "components/utils/warningMessage";
import LoadingSpinner from "components/shared/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { bookTypeChanged } from "features/books/booksSlice";

const Books = () => {
  const { searchKey, type } = useSelector((state) => state.booksFilterInfo);

  // rtk query
  const { data: books, isLoading, isError } = useGetBooksQuery();

  // dispatch
  const dispatch = useDispatch();

  // filters
  const filterByFeatured = (book) => {
    if (type === "featured") {
      return !!book.featured;
    }
    return true;
  };
  const searchFilter = (book) => book?.name?.toLowerCase()?.includes(searchKey);

  return (
    <main className="py-12 px-6 2xl:px-6 container">
      <div className="order-2 xl:-order-1">
        <div className="flex items-center justify-between mb-12">
          <h4 className="mt-2 text-xl font-bold">Book List</h4>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              className={`lws-filter-btn ${type === "all" && "active-filter"}`}
              onClick={() => dispatch(bookTypeChanged("all"))}
            >
              All
            </button>
            <button
              type="button"
              className={`lws-filter-btn ${
                type === "featured" && "active-filter"
              }`}
              onClick={() => dispatch(bookTypeChanged("featured"))}
            >
              Featured
            </button>
          </div>
        </div>

        {(() => {
          if (isLoading) {
            return <LoadingSpinner />;
          }
          if (isError) {
            return warningMessage("There was an error ocurred!");
          }
          if (size(books)) {
            if (size(books?.filter(filterByFeatured)?.filter(searchFilter))) {
              return (
                <div className="space-y-6 md:space-y-0 md:grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {books
                    ?.filter(filterByFeatured)
                    ?.filter(searchFilter)
                    ?.map((book) => (
                      <Book key={book?.id} book={book} />
                    ))}
                </div>
              );
            }
            return warningMessage(
              "We're sorry. We cannot find any matches for your search term or filter."
            );
          }
          return warningMessage("We did not find anything to show here.");
        })()}
      </div>
    </main>
  );
};

export default Books;
