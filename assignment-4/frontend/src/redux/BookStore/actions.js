import {LOADED_BOOK ,ADD_BOOK, REMOVE_BOOK, UPDATE_BOOK} from "./actionTypes";



export const loadedBook = (books)=>{
    return {
        type: LOADED_BOOK,
        payload: books
    }
}

export const addBook = (bookObj)=>{
    return {
        type: ADD_BOOK,
        payload: bookObj
    }
}


export const removeBook = (id)=>{
    return {
        type: REMOVE_BOOK,
        payload: id
    }
}


export const updateBook = (bookObj)=>{
    return {
        type: UPDATE_BOOK,
        payload: bookObj
    }
}