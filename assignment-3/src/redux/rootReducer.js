import { combineReducers } from "redux";
import productReducer from "./product/productReducer";
import cartReducer from './cart/cartReducer';



const rootReducer = combineReducers({
    products: productReducer,
    carts: cartReducer
})

export default rootReducer;