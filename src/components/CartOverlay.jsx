// IMPORTS -->
  // React, React Router
import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
  // Icons
import cartIcon from '../assets/icon/cartEmpty--dark.svg';
import CartProducts from './CartProducts';


// COMPONENTS -->
const CartOverlay = () => {
  //STATE -->
    // To toggle overlay visibility
  const [isOpen, setIsOpen] = useState(false);

  //VARIABLES -->
    // To handle click outside overlay block
  const overlayRef = useRef(null);
  const overlayContainerRef = useRef(null);
  const buttonOverlay = useRef(null);
    // To display total quantity inside cart badge
  const totalQuantity = useSelector(state => state.totalQuantity);
  const totalPrice = useSelector(state => state.totalPrice);
  const selectedCurrency = useSelector(state => state.currencySymbol);

  // ON MOUNT --> 
  useEffect(() => {
    // If click was made outside referenced object, change state
  const handleClickOutside = (event) => {
    if (overlayRef.current.className.includes('open') && !overlayContainerRef.current.contains(event.target) && !buttonOverlay.current.contains(event.target)) {
      handleOverlay();
    }
  }
    // On render
    document.addEventListener('mousedown', handleClickOutside);
    // Will unmount
    return () => document.addEventListener('mousedown', handleClickOutside);
  },[overlayRef, overlayContainerRef]);
  
  //HANDLERS -->
    //To toggle cart overlay
  const handleOverlay = () => {
    setIsOpen(prev => {
      console.log(prev);
      return !prev;
    });
  }
    
  //RENDER -->
  return (
    <section className="cart">
      <button className='btn btn__icon' onClick={handleOverlay} ref={buttonOverlay}>
        <img src={cartIcon} alt="cart" />
        {totalQuantity !== 0 ?         
          <span className="cart__badge">
            {totalQuantity}
          </span>
          : undefined
        }
      </button>
      <div className={`cart__overlay ${isOpen ? "open" : "closed"}`} ref={overlayRef} >
        <div className='cart__container' ref={overlayContainerRef}>
          <div className="cart__product-list">
            <p className='cart__product-quantity'><strong>My bag,</strong>
             {totalQuantity === 0 || totalQuantity === 1 ? ` ${totalQuantity} item` : ` ${totalQuantity} items`}
             </p> 
            <CartProducts location='overlay'/>
            <div className="cart__product-total">
              <p className='cart__text'>Total</p>
              <p className='cart__amount'>{selectedCurrency}{totalPrice}</p>
            </div>
          </div>
          <div className="cart__buttons">
            <Link to='/cart' >
              <button className='btn btn__secondary' onClick={handleOverlay}>
                VIEW BAG
              </button>
            </Link>
            <Link to='/cart' >
              <button className='btn btn__primary' onClick={handleOverlay}>
                CHECK OUT
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
)
}

export default CartOverlay
