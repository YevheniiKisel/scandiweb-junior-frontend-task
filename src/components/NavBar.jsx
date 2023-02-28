// IMPORTS -->
  // React, React Router
import React from 'react';
import { Link, NavLink, } from "react-router-dom";
  //Apollo
import { gql, useQuery } from '@apollo/client';
  // Icons
import logoIcon from '../assets/icon/logo.svg';
  // Components
import CurrencySwitcher from './CurrencySwitcher';
import CartOverlay from './CartOverlay';


// CONSTS -->
  // Get category list from EP
const CATEGORY_LIST_QUERY = gql`
  query categoryList {
    categories{
      name
    }
  }
`

// COMPONENTS -->
const NavBar = () => {

  // VARIABLES -->
    // To store fetched data from EP
  const { loading, error, data } = useQuery(CATEGORY_LIST_QUERY);

  // RENDER -->
  return (
    <>
    {loading && <p>Loading...</p>}
    {error && <p>{`Error! ${error.message}`}</p>}
    {data && 
      <nav className='navbar'>
        <ul className='navbar__categories'>
          {
            data.categories.map((category, index) => {
              return (
                <li key={index}>
                  <NavLink to={"/" + category.name} className={({isActive}) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'} >                 
                        {category.name.toUpperCase()}  
                  </NavLink>
                </li>
              )
            })
          }
        </ul>
        <div className="navbar__logo">
          <Link to="/all">
            <img src={logoIcon} alt="logo" />
          </Link>
        </div>
        <div className="navbar__features">
          <CurrencySwitcher />
          <CartOverlay />
        </div>
      </nav>
    }
    </>
  )
} 

export default NavBar
