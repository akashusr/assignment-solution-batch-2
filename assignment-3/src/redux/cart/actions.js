import { ADD_TO_CART, REMOVE_FROM_CART, DELETE_ITEM } from "./actionType";


export const addCart = (product) => {
    return {
        type: ADD_TO_CART,
        payload: product,
    };
};


export const removeCart = (product) => {
    return {
        type: REMOVE_FROM_CART,
        payload: product,
    };
};

export const deleteCart = (product) => {
    return {
        type: DELETE_ITEM,
        payload: product,
    };
};



