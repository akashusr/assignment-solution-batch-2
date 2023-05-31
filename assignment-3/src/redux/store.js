import { applyMiddleware, createStore } from "redux";
import rootReducer from "./rootReducer";
import { composeWithDevTools } from 'redux-devtools-extension';
import { ADD_TO_CART, REMOVE_FROM_CART, DELETE_ITEM } from './cart/actionType';
import { addProductQuantity, removeProductQuantity, addManyQuantity } from './product/actions';

const productManagementMiddleware = (store)=>(next)=>(action)=>{
    switch (action.type){
        case ADD_TO_CART:
            store.dispatch(removeProductQuantity(action.payload));
            return next(action);

        case REMOVE_FROM_CART:
            store.dispatch(addProductQuantity(action.payload));
            return next(action);

        case DELETE_ITEM:
            store.dispatch(addManyQuantity(action.payload));
            return next(action);
        default: 
        return next(action)
    }
}

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(productManagementMiddleware)));

export default store;