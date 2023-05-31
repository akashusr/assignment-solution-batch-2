import CartItem from './cartPage/CartItem';
import BillSection from './cartPage/BillSection';
import { useSelector } from 'react-redux';

export default function CartPage(){
  const carts = useSelector(state=>state.carts)
  return(
    <>
      <div className="container 2xl:px-8 px-2 mx-auto">
                        <h2 className="mb-8 text-xl font-bold">Shopping Cart</h2>
                        <div className="cartListContainer">
                            <div className="space-y-6">
                                {/* <!-- Cart Item --> */}
                               {carts.length>= 1 ? 
                               carts.map(item=><CartItem key={item.id} product={item} />) :
                                "You have no Product in cart"
                                }
                                {/* <!-- Cart Items Ends --> */}

                            </div>

                            {/* <!-- Bill Details --> */}
                            <div>
                                <BillSection />
                            </div>
                        </div>
                    </div>
    </>
  )};