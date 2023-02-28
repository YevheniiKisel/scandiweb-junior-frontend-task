// IMPORTS -->
  //React, React Router, React Redux
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
    //Actions
import { addToCart } from '../features/cart/cartSlicer';
  //Utilities
import showPrice from '../utilities/showPrice';
  //Icons
import cartIcon from '../assets/icon/cartEmpty--light.svg';
  //Components
import ModalWindow from './ModalWindow';


// COMPONENTS -->
const ProductCard = ({products}) => {
  // STATES --> 
    // To toggle modal window
  const [modalOpen, setModalOpen] = useState(false);
  // VARIABLES -->
    // To show a proper currency symbol and price
  const selectedCurrency = useSelector(state => state.currencySymbol);
    // Dispatch an actions
  const dispatch = useDispatch();

  // HANDLERS --> 
    //To add product with default attributes to the cart
  const handleAddToCart = (product) => {
      //Get a shape of data for cart
    const {__typename, description, inStock, category, ...castedProduct} = product;
      //Get a default attribute array and add it to castedProduct
    const defaultAttributes = product.attributes.map(attribute => ({
      nameID: attribute.id,
      checked: attribute.items[0].id
    }));
    castedProduct.checkedAttributes = defaultAttributes;
    dispatch(addToCart(castedProduct));
    setModalOpen(true);


  }


  // RENDER -->
  return (
    <>
    { modalOpen && <ModalWindow setModalOpen={setModalOpen} action='add to cart'/>}
    <section className='product'>
      <ul className="product__list">
        {
          products.map((product, index) => {
            return (
              <li key={index} className="product__wrapper">
                {!product.inStock && 
                  <div className="product__overlay">
                    <span className="product__message">OUT OF STOCK</span>
                  </div>
                }
                <Link className="product__card" to={"/" + product.category + "/product/" + product.id}>
                  <img className='product__image' src={product.gallery[0]} alt="Product" width="354" height="330" />
                  <p className="product__name">{product.brand} {product.name}</p>
                  <p className="product__price">{selectedCurrency} {showPrice(product.prices, selectedCurrency)}</p>
                </Link>
                <button className='btn btn__primary btn__primary--round product__button' onClick={() => handleAddToCart(product)}>
                  <img src={cartIcon} alt="add to cart" width="24" height="24" />
                </button>
              </li>
            )
          })
        }
      </ul>
    </section>
    </>
  )
}

export default ProductCard
