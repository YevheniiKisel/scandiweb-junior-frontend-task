// IMPORTS -->
  // React, React Redux
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
    //Actions
import { incrementQuantity, decrementQuantity } from '../features/cart/cartSlicer';
  // Utilities
import showPrice from '../utilities/showPrice';
  // Icons
import minus from '../assets/icon/minus.svg';
import plus from '../assets/icon/plus.svg';
import pagination_left from '../assets/icon/pagination_left.svg';
import pagination_right from '../assets/icon/pagination_right.svg';


// COMPONENTS --> 
const CartProducts = ({location}) => {
  // VARIABLES -->
  //Retrieve data from global state
  const productList = useSelector(state => state.productList);
  // To show a proper currency symbol and price
  const selectedCurrency = useSelector(state => state.currencySymbol);
  // Dispatch an actions
  const dispatch = useDispatch();
  
  // STATE -->
  const [activeImage, setActiveImage] = useState(Array(productList.length).fill(0));

  // ON MOUNT -->
  useEffect(() => {
    //Set state with array of zeros q-ty of which is equal to the quantity of elements inside productList state
    setActiveImage(Array(productList.length).fill(0));
  }, [productList]);


  // HANDLERS -->
    // To check which attribute is active and implement style on it
    const handleActiveAttribute = (product, itemID, attributeID) => {
      const checkedAttribute = product.checkedAttributes.find(obj => obj.nameID === attributeID);
      return (checkedAttribute.checked === itemID ? 'checked' : '');
    }
    // To handle image pagination
  const handleImagePagination = (productIndex, action) => {
    // Get image gallery of the particular product
    const {gallery} = productList[productIndex];
    // Get a max index inside gallery, to prevent IndexError
    const galleryMaxIndex = gallery.length - 1;
    // Get an element which store currenctly active image index for this product
    const activeIndex = activeImage[productIndex];
    switch (action) {
      case 'previous':
        // If it's not a first picture, may go to the previous one
        if (activeIndex !== 0) {
          setActiveImage(prev => {
            const newActiveImage = [...prev];
            newActiveImage[productIndex] = activeIndex - 1;
            return newActiveImage;
          });
        } 
        break;
      case 'next':
        // If it's not a last picture, may go to the next one
        if (activeIndex !== galleryMaxIndex) {
          setActiveImage(prev => {
            const newActiveImage = [...prev];
            newActiveImage[productIndex] = activeIndex + 1;
            return newActiveImage;
          });
        }
      default:
        break;
    }
  }

  // RENDER -->
  return (
    productList && 
    <section className={`cart-products ${location}`}>
      {productList.map((product, indexInCart) => {
        return (
        <div className="product" key={indexInCart}>
          <div className="product__description">
            <div className="description__wrapper">
              <p className="description__brand">{product.brand}</p>
              <p className="description__name">{product.name}</p>
            </div>
            <p className="description__price">{selectedCurrency} {showPrice(product.prices, selectedCurrency)}</p>
            <ul className="description__attributes">
              {product.attributes.map(attribute => {
                return (
                  <li className="attribute" key={attribute.id}>
                    <p className='attribute__name'>{attribute.name.toUpperCase()}: </p>
                    <div className="attribute__values">
                      { attribute.type !=='swatch' ?
                        attribute.items.map(item => {
                          return (
                            <button key={item.id} className={`btn btn__secondary value__text ${handleActiveAttribute(product, item.id, attribute.id)}`} title={item.displayValue} disabled>
                              {item.value}
                            </button>
                          )
                        })
                        :
                        attribute.items.map(item => {
                          return (
                            <button key={item.id} className={`btn btn__secondary value__color ${handleActiveAttribute(product, item.id, attribute.id)}`} style={{backgroundColor: item.value}} title={item.displayValue} disabled/>
                          )
                        })
                      }
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="product__features">
            {location === 'page' ? 
            <>
            <div className="feature__quantity">
              <button className="btn btn__toggle--mini quantity__increment" onClick={() => dispatch(incrementQuantity(indexInCart))}>
                <img src={plus} alt="increment"/>
              </button>
              <p className="quantity__value">{product.quantity}</p>
              <button className="btn btn__toggle--mini quantity__decrement" onClick={() => dispatch(decrementQuantity(indexInCart))}>
                <img src={minus} alt="decrement" />
              </button>
            </div>
            <div className="feature__image">
              <img src={product.gallery[activeImage[indexInCart]]} alt="product" className='image'/>
              <div className="image__pagination">
                <button className="btn btn__pagination pagination__prev" onClick={() => handleImagePagination(indexInCart, 'previous')}>
                  <img src={pagination_left} alt="previous" />
                </button>
                <button className="btn btn__pagination pagination__next" onClick={() => handleImagePagination(indexInCart, 'next')}>
                  <img src={pagination_right} alt="next" />
                </button>
              </div>
            </div>
            </>
            :
            <>
            <div className="feature__quantity">
              <button className="btn btn__toggle--mini quantity__increment" >
                <img src={plus} alt="increment"/>
              </button>
              <p className="quantity__value">{product.quantity}</p>
              <button className="btn btn__toggle--mini quantity__decrement" >
                <img src={minus} alt="decrement" />
              </button>
            </div>
            <div className="feature__image">
              <img src={product.gallery[activeImage[indexInCart]]} alt="product" className='image'/>
            </div>
            </>

            }
          </div>
        </div>
        )
      })}
      
    </section>
    
  )
}

export default CartProducts
