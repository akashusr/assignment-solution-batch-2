import { useDispatch } from "react-redux"
import { addCart } from "../../redux/cart/actions";


export default function Product({product}){
  const dispatch = useDispatch();
  const addToCatHandler = ()=>{
      dispatch(addCart(product))
  }
  const { name, category, imgUrl, price, quantity } = product
  return(
    
     
        <div className="lws-productCard">
          <img className="lws-productImage" src={imgUrl} alt={name} />
          <div className="p-4 space-y-2">
            <h4 className="lws-productName">{name}</h4>
            <p className="lws-productCategory">{category}</p>
            <div className="flex items-center justify-between pb-2">
              <p className="productPrice">BDT <span className="lws-price">{price}</span></p>
              <p className="productQuantity">QTY <span className="lws-quantity">{quantity}</span></p>
            </div>
            <button disabled={product.quantity <= 0} onClick={addToCatHandler} className="lws-btnAddToCart">Add To Cart</button>
          </div>
        </div>
  )};