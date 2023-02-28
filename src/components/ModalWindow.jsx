// IMPORTS -->
  //React, React Router
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';


// COMPONENTS -->
const ModalWindow = ({setModalOpen, action}) => {
  // VARIABLES 
    //To handle click outside
  const modalRef = useRef(null);

  // ON MOUNT -->
  useEffect(() => {
    // If click was made outside referenced object, change state
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen(false);
      }
    }
    // On render
    document.addEventListener('mousedown', handleClickOutside);
    // Will unmount
    return () => document.addEventListener('mousedown', handleClickOutside);
  }, [modalRef, setModalOpen]);  

  // RENDER -->
  return (
    <div className='modal'>
      <div className="modal__window" ref={modalRef}>
        <p className="window__title">Done!</p>
        { action === 'add to cart' ? 
          <>
          <p className="window__text">Item has been added to your bag</p>
          <div className="window__buttons">
            <button className="btn btn__secondary" onClick={() => setModalOpen(false)}>
              Continue shopping
            </button>
            <Link to='/cart' className="btn btn__primary">
                View cart
            </Link>
          </div>
          </>
        : action === 'place order' ?
          <>
          <p className="window__text">Your order has been successfully placed!<br/>Have a nice day ;)</p>
          <div className="window__buttons">
              <Link to='/all' >
                <button className="btn btn__primary">
                  Return HOME
                </button>
                  
              </Link>
          </div>
          </>
        : undefined}
      </div>
      
    </div>
  )
}

export default ModalWindow
