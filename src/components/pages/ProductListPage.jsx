// IMPORTS -->
  // React, React Router, React Redux
import React from 'react'
import { useParams } from 'react-router-dom'
  // Lodash
import {capitalize} from 'lodash';
  // Apollo Client
import { gql, useQuery } from '@apollo/client';
  // Components
import ProductCard from '../ProductCard';

// CONSTS -->
  // Get products from EP by category name
  const GET_PRODUCTS_BY_CATEGORY = gql`
  query productsByCategory ($categoryName: String!) {
    category(input: {title: $categoryName}){
      products{
        id
        name
        gallery              
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
        
        category
        inStock
      }
    }  
  }
`


// COMPONENTS -->
const ProductListPage = () => {
  // VARIABLES -->
    // To store actual category from path in order to use it as a variable in query
  const {category} = useParams();
    // To store fetched data from EP
  const {loading, error, data } = useQuery(GET_PRODUCTS_BY_CATEGORY, {variables: {categoryName: category}, fetchPolicy: 'no-cache'});
  const productArray = (data) => data.category.products;

  // RENDERS -->
  return (
    <main className='plp'>
      <h1 className='plp__title'>
        {capitalize(category)} 
       </h1>
      <section className='plp__products-list'>
      { loading && <h1>Loading...</h1>}
      { error && <h1>Error T_T</h1>}
      { data && 
        <ProductCard products={productArray(data)}/>
      }
      </section>
    </main>
  )
}

export default ProductListPage
