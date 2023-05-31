import { ADD_TO_CART, REMOVE_FROM_CART, DELETE_ITEM } from "./actionType";


const isExist = (state, payload)=>state.some(item=>item.id === payload.id);

const initialState = [];

const cartReducer = (state = initialState, action) => {
    const copiedState = [...state]
    const { type, payload } = action

    switch (type) {
        // add product to cart
        case ADD_TO_CART:

            if(isExist(state, payload)){
                if(payload.quantity <= 0){
                    return state
                }
            return copiedState.map(item => item.id === payload.id ? { ...item, cartQuantity: item.cartQuantity +1, quantity: item.quantity -1   } : item);
            }else{
               
                copiedState.push({...payload, cartQuantity: 1 , quantity: payload.quantity -1})
                return copiedState
            }
            
        case REMOVE_FROM_CART:
            const currentItem = state.find(item=>item.id ===payload.id)
            if(currentItem.cartQuantity > 1){
            return copiedState.map(item => item.id === payload.id ?  { ...item, cartQuantity: item.cartQuantity-1, quantity: item.quantity + 1 } : item);
            }else{
                return copiedState.filter(item=>item.id !== payload.id)
            }
        
        case DELETE_ITEM: 
            return copiedState.filter(item=>item.id !== payload.id)


        default:
            return state;
    }
};

export default cartReducer;