import { createStore , applyMiddleware} from "redux";
import bookStoreReducer from "./BookStore/bookStoreReducer";
import thunk from 'redux-thunk'


const store = createStore(bookStoreReducer, applyMiddleware(thunk))

export default store;