import { ADD_BOOK, LOADED_BOOK, REMOVE_BOOK, UPDATE_BOOK } from "./actionTypes";



const initialState = []

const bookStoreReducer = (state = initialState, action) => {
    const copiedState = [...state]
    const { type, payload } = action

    switch (type) {
        case LOADED_BOOK:
            return action.payload


        case ADD_BOOK:
            return [...state, {...payload}]

        case REMOVE_BOOK:
            return copiedState.filter(item=>item.id !== payload);


        case UPDATE_BOOK:
            return copiedState.map(item => item.id === payload.id ? { ...payload } : item);
        default:
            return state
    }

}

export default bookStoreReducer;