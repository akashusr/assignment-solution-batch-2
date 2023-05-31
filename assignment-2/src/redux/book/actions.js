import { BOOK, DELETE } from "./actionType";

export const book = (value) => {
    return {
        type: BOOK,
        payload: value,
    };
};

export const deleteBook = (id) => {
    return {
        type: DELETE,
        id: id,
    };
};