// IMPORTS -->
  //React, React Redux, React Router
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
  // Action creators
import { addToCart } from '../../features/cart/cartSlicer';
  //Appolo Client  
import { gql, useQuery } from '@apollo/client'
  // Utilities
import showPrice from '../../utilities/showPrice'
import parse from 'html-react-parser';
  // Components
import ModalWindow from '../ModalWindow';
  
  
// CONSTS -->
  // Get product's details from EP by productID
const GET_PRODUCT_DETAILS = gql`
  query productDetails ($productID: String!){
    product(id: $productID){
      id
      name
      gallery
      description
      attributes{
        id
        name
        type
        items{
          displayValue
          value
          id
        }
      }
      prices{
        amount
        currency{
          symbol
          label
        }
      }
      brand
    }
  }
`
 

// COMPONENTS -->
const ProductDetailsPage = () => {
  // STATE -->
    // To toggle active image
  const [activeImage, setActiveImage] = useState();
    // To store information about product
  const [productInfo, setProductInfo] = useState();
    // To toggle active attribute of product
  const [isChecked, setIsChecked] = useState();
    // To toggle modal window
  const [modalOpen, setModalOpen] = useState(false)
  
  // VARIABLES -->
    // To store actual productID from path in order to use it as a variable in query
  const {productID} = useParams();
    // To get global state currency in order to display a right one price
  const selectedCurrency = useSelector(state => state.currencySymbol);
    // To dispatch actions
  const dispatch = useDispatch();
    // To store fetched data from EP
  const {loading, error, data } = useQuery(GET_PRODUCT_DETAILS, {variables: {productID: productID}, fetchPolicy: 'network-only'},);

  // ON MOUNT -->
  useEffect(()=> {
    // After successful fetching, set state
    if (!loading && data){
      // Destructure fetched data and get needed object
      const {product} = data;
      // Get all product details
      setProductInfo(product);
      // Set as start image a first on inside gallery 
      setActiveImage(product.gallery[0]);
      // Set as selected attribute every first item inside each attribute group
      const isChecked = product.attributes.map(attribute => ({
        nameID: attribute.id,
        checked: attribute.items[0].id
      }));
      setIsChecked(isChecked);

    }
  }, [data, loading]);
  
  //HANDLERS -->
    // To toggle active image
  const handleActiveImage = (image) => {
    setActiveImage(image);
  }
    // To check which attribute is active and implement style on it
  const handleActiveAttribute = (itemID, attributeID) => {
    const checkedAttribute = isChecked.find(obj => obj.nameID === attributeID);
    return (checkedAttribute.checked === itemID ? 'checked' : '');
  }
    // To toggle active attribute 
  const toggleActiveAttribute = (itemID, attributeID) => {
    const updatedState = isChecked.map(obj => obj.nameID === attributeID ? {...obj, checked: itemID} : obj);
    setIsChecked(updatedState);
  }
    // To cast an object for push inside global store RTK
  const handleAddProduct = () => {
    const {__typename, description, ...castedProduct} = productInfo;
    const pushProduct = {...castedProduct, checkedAttributes: isChecked};
    console.log(pushProduct);
    dispatch(addToCart(pushProduct));
    setModalOpen(true);
  }

  //RENDERS -->
  return (
    <>
    { modalOpen && <ModalWindow setModalOpen={setModalOpen} action={'add to cart'}/>}
    { loading && <h1>Loading...</h1>}
    { error && <h1>Error T_T</h1>}
    { productInfo && 
      <section className='pdp'>
        <ul className="pdp__image-carousel">
          {
            productInfo.gallery.map((image, index) => {
              return(
                <li key={index} >
                  <img src={image} alt={`product view Nr.${index}`} className="pdp__image" onClick={() => handleActiveImage(image)}/>
                </li>
              )
            })
          }
        </ul>
        <div className='pdp__product-details'>
          <div className="pdp__image-active">
            <img src={activeImage} alt="product" width="610" height="511" />
          </div>
          <div className="pdp__product-description">
            <p className="pdp__product-brand">{productInfo.brand}</p>
            <p className="pdp__product-name">{productInfo.name}</p>
            <ul className="pdp__product-attributes">
              {
                productInfo.attributes.map((attribute) => {
                  return (
                    <li className="pdp__attribute" key={attribute.id}>
                      <p className="pdp__attribute-name">{attribute.name.toUpperCase()}</p>
                      <div className="pdp__attribute-values">
                        { 
                          attribute.type !== "swatch" ? 
                            attribute.items.map((value) => {
                              return (
                                <button key={value.id} className={`btn btn__secondary pdp__attribute--text ${handleActiveAttribute(value.id, attribute.id)}`} onClick={() => toggleActiveAttribute(value.id, attribute.id)} title={value.displayValue}>
                                  {value.value}
                                </button>
                              )
                            })
                            :
                            attribute.items.map((value) => {
                              return (
                                <button key={value.id} className={`btn btn__secondary pdp__attribute--color ${handleActiveAttribute(value.id, attribute.id)}`} onClick={() => toggleActiveAttribute(value.id, attribute.id)} style={{backgroundColor: value.value}} title={value.displayValue}/>
                              )
                            })
                        }
                      </div>
                    </li>
                  )
                })
              }
              <li className="pdp__price">
                <p className="pdp__price-title">PRICE:</p>
                <p className="pdp__price-amount">{selectedCurrency}{showPrice(productInfo.prices, selectedCurrency)}</p>
              </li>
            </ul>
            <button className="btn btn__primary pdp__button" onClick={() => handleAddProduct()}>ADD TO CART</button>
            <p className="pdp__product-about">
              {parse(productInfo.description)}
            </p>
          </div>
        </div>
      </section>
    }
    </>
  )
} 

export default ProductDetailsPage
  