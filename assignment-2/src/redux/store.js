import { createStore } from "redux";
import bookReducer from "./book/bookReducer";

const store = createStore(bookReducer);

export default store;