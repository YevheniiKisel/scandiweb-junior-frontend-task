// IMPORTS -->
  // React, React Redux, RTK
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
    //Action creators
import { setCurrency } from '../features/cart/cartSlicer';
  //Apollo
import { gql, useQuery } from '@apollo/client';
  // Icons
import openDropdown from '../assets/icon/chevronDown.svg';
import closeDropdown from '../assets/icon/chevronUp.svg';


// CONST -->
  // Get currency list from EP
const GET_CURRENCY_LIST = gql`
  query currencyList {
    currencies{
      label
      symbol
    }
  }
`


// COMPONENTS -->
const CurrencySwitcher = () => {
  // STATES -->
    // For dropdown menu controlling
  const [isOpen, setIsOpen] = useState(false);

  // VARIABLES -->
    // Display currency global state
  const selectedCurrency = useSelector(state => state.currencySymbol)
    // Dispatch an actions
  const dispatch = useDispatch();
    //To handle click outside
  const dropdownRef = useRef(null);
  const buttonDropdown = useRef(null);
    // To store fetched data from EP
  const { loading, error, data } = useQuery(GET_CURRENCY_LIST);

  // ON MOUNT --> 
  useEffect(() => {
    // On render
    document.addEventListener('mousedown', handleClickOutside);
    // Will unmount
    return () => document.addEventListener('mousedown', handleClickOutside);
  },[dropdownRef])

  // HANDLERS -->
    // To toggle dropdown menu
  const hadleDropDown = () => {
    setIsOpen(prev => !prev);
  };
    // To switch currency to another one
  const handleCurrencyChange = (symbol) => {
  dispatch(setCurrency(symbol));
  hadleDropDown();
}
    // If click was made outside referenced object, change state
  const handleClickOutside = (event) => {
    if (dropdownRef.current.className.includes('open') && !dropdownRef.current.contains(event.target) && !buttonDropdown.current.contains(event.target)) {
      setIsOpen(false);
    }
  }

  // RENDER -->
  return (
    <>
    {loading && <p>Loading...</p>}
    {error && <p>{`Error! ${error.message}`}</p>}
    {data && 
      <section className='currency'>
        <button className='btn btn__icon currency__icon' onClick={hadleDropDown} ref={buttonDropdown}>
          {selectedCurrency} <img src={isOpen ? closeDropdown : openDropdown } alt="toggle dropdown" /> 
        </button>
        <ul className={`currency__dropdown ${isOpen ? "open" : "closed" }`} ref={dropdownRef}>
          {
            data.currencies.map((currency, index) => {
              return (
                <li key={index}>
                  <button className="btn btn__list currency__button" onClick={() => handleCurrencyChange(currency.symbol)}>
                    {currency.symbol} {currency.label}
                  </button>
                </li>
              )
            })
          }
        </ul>
      </section>
    }
    </>
  )
}

export default CurrencySwitcher
