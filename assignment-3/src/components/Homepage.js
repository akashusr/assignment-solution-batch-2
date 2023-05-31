import { useSelector } from "react-redux";
import InputForm from "./productsPage/InputForm";
import Product from "./productsPage/Product";



export default function Homepage() {
    const products = useSelector(state=>state.products)
    return (
        <>
            <div className="productWrapper">
                <div className="productContainer" id="lws-productContainer">
                    {products.length >= 1 ? products.map(item=><Product key={item.id} product={item} />) :
                    "No product found"
                    }
                
                </div>
                <InputForm />
            </div>
        </>
    )
};