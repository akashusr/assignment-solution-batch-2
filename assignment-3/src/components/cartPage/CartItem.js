
import { useDispatch } from 'react-redux';
import { addCart, deleteCart, removeCart } from './../../redux/cart/actions';

export default function CartItem({product}) {
    const dispatch = useDispatch()
    const { cartQuantity, name, imgUrl, price, category} = product
    const total = price * cartQuantity

    const addToCartHandler = ()=>{
        dispatch(addCart(product))
    }

    const removeCartHandler =()=>{
        dispatch(removeCart(product))
    }

    const deleteHandler = ()=>{
        dispatch(deleteCart(product))
    }
    return (
        <>
            <div className="cartCard">
                <div className="flex items-center col-span-6 space-x-6">
                    {/* <!-- cart image --> */}
                    <img className="lws-cartImage" src={imgUrl} alt="product" />
                    {/* <!-- cart item info --> */}
                    <div className="space-y-2">
                        <h4 className="lws-cartName">{name}</h4>
                        <p className="lws-cartCategory">{category}</p>
                        <p>BDT <span className="lws-cartPrice">{price}</span></p>
                    </div>
                </div>
                <div className="flex items-center justify-center col-span-4 mt-4 space-x-8 md:mt-0">
                    {/* <!-- amount buttons --> */}
                    <div className="flex items-center space-x-4">
                        <button onClick={addToCartHandler} className="lws-incrementQuantity">
                            <i className="text-lg fa-solid fa-plus"></i>
                        </button>
                        <span className="lws-cartQuantity">{cartQuantity}</span>
                        <button onClick={removeCartHandler} className="lws-decrementQuantity">
                            <i className="text-lg fa-solid fa-minus"></i>
                        </button>
                    </div>
                    {/* <!-- price --> */}
                    <p className="text-lg font-bold">BDT <span className="lws-calculatedPrice">{total}</span></p>
                </div>
                {/* <!-- delete button --> */}
                <div className="flex items-center justify-center col-span-2 mt-4 md:justify-end md:mt-0">
                    <button onClick={deleteHandler} className="lws-removeFromCart">
                        <i className="text-lg text-red-400 fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </>
    )
};