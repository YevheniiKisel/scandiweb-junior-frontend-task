// IMPORTS -->
  //React, React Redux
import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
    // Actions
import { order } from '../../features/cart/cartSlicer';
  // Components
import CartProducts from '../CartProducts';
import ModalWindow from '../ModalWindow';
  // Lodash
import { floor } from 'lodash';


// COMPONENTS -->
const CartPage = () => {
  // VARIABLES -->
    // To get currencySwitcher from global store
  const selectedCurrency = useSelector(state => state.currencySymbol);
    // To get totalPrice from global store
  const totalPrice = useSelector (state => state.totalPrice);
    // To get totalQuantity from global store
  const totalQuantity = useSelector(state => state.totalQuantity);
    // To dispatch actions
  const dispatch = useDispatch();

  // STATES -->
    // To toggle modal window
  const [modalOpen, setModalOpen] = useState(false);

  // HANDLERS -->
    // To handle order process
  const handleOrder = () => {
    dispatch(order());
    setModalOpen(true);
  };

  // RENDER -->
  return (
    <>
    { modalOpen && <ModalWindow setModalOpen={setModalOpen} action={'place order'}/>}
    <section className='cart'>
      <h1 className='cart__header'>CART</h1>
      <CartProducts location='page' />         
       <div className="cart__total">
        <table className='amount'>
          <tbody>
            <tr className='amount__tax'>
              <td>Tax 21%: </td>
              <td><strong>{selectedCurrency}{floor(totalPrice * 0.21, 2)}</strong></td>
            </tr>
            <tr className='amount__quantity'>
              <td>Quantity: </td>
              <td><strong>{totalQuantity}</strong></td>
            </tr>
            <tr className='amount__total'>
              <td>Total: </td>
              <td><strong>{selectedCurrency}{totalPrice}</strong></td>
            </tr>
          </tbody>
        </table>
        
        <button className="btn btn__primary total__button" onClick={() => handleOrder()}>
          ORDER
        </button>
      </div> 

    </section>
  </>
  )
}

export default CartPage
