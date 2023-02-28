// IMPORTS -->
  // RTK
import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
  productList: [],
  totalQuantity: 0,
  totalPrice: 0,
  currencySymbol: '$'
};



const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // To handle switch currency
    setCurrency: (state, action) => {
      state.currencySymbol = action.payload;
      // Update state totalPrice
      cartSlice.caseReducers.calculateTotalPrice(state);
    },
    // To handle total price calculation
    calculateTotalPrice: (state) => {
      let totalPrice = 0;
      state.productList.forEach(product => {
        product.prices.forEach(price => {
          if (price.currency.symbol === state.currencySymbol){
            totalPrice += price.amount * product.quantity;
          }
        })
      })
      state.totalPrice = _.floor(totalPrice, 2);
    },
    // To handle add to cart action
    addToCart: (state, action) => {
      // Make a deep copy of state in order to provide full check
      const deepCopy = JSON.parse(JSON.stringify(state.productList));
      //First, find all products, that has the same ID as a pushed one inside payload.
      const similarProducts = deepCopy.filter(product => product.id === action.payload.id);
      // If such products exist, find if there is any product which has identical checked attributes
      if (similarProducts.length !== 0) {
        // Map over every product. If there is any identical product we will get it's index (just one identical product could be inside state)
        const identicalProduct = similarProducts.find(product => {
          return _.isEqual(product.checkedAttributes, action.payload.checkedAttributes);
        })
        // If product with identical checkedAttributes in state is found, increment quantity of present product in cart and update state
        if (identicalProduct !== undefined){
          deepCopy.forEach(product => {
            console.log(product, 'deep copy for each');// TEST !!!!!!!!!!!!!!!!
            const isEqual = _.isEqual(product, identicalProduct);
            if (isEqual) {
              product.quantity ++;
              state.totalQuantity ++;
              // Update totalPrice state
              cartSlice.caseReducers.calculateTotalPrice(state);
            }
          });
          // Update state productList
          state.productList = [...deepCopy];
          // Update totalPrice state
          cartSlice.caseReducers.calculateTotalPrice(state);
        }
        // If the are no such product with identical checkedAttributes, just push payload to the state
        else {
          state.productList.push({...action.payload, quantity: 1});
          state.totalQuantity ++;
          // Update totalPrice state
          cartSlice.caseReducers.calculateTotalPrice(state);

        }
      }
      // If there is no product with such ID, just push payload to the state
      else {
        state.productList.push({...action.payload, quantity: 1});
        state.totalQuantity ++;
        // Update totalPrice state
        cartSlice.caseReducers.calculateTotalPrice(state);
      }            
    },
    // To handle increament quantity feature
    incrementQuantity: (state, action) => {
      const product = state.productList[action.payload];
      if (product) {
        product.quantity ++;
        state.totalQuantity ++;
        // Update totalPrice state
        cartSlice.caseReducers.calculateTotalPrice(state);

      }
    },
    // To handle decrement quantity feature and deleting
    decrementQuantity: (state, action) => {
      const product = state.productList[action.payload];
      if (product && product.quantity > 1){
        product.quantity --;
        state.totalQuantity --;
        // Update totalPrice state
        cartSlice.caseReducers.calculateTotalPrice(state);

      } else {
        state.totalQuantity --;
        state.productList.splice(action.payload, 1);
        // Update totalPrice state
        cartSlice.caseReducers.calculateTotalPrice(state);

      }
    },
    // To handle order process (empty cart)
    order: (state) => {
      //Reset totalQuantity state
      state.totalQuantity = initialState.totalQuantity;
      //Reset productsList state
      state.productList = initialState.productList;
      //Reset totalPrice state
      state.totalPrice = initialState.totalPrice;
    }
  }
})

export const {setCurrency, addToCart, incrementQuantity, decrementQuantity, calculateTotalPrice, order} = cartSlice.actions;
export default cartSlice.reducer;

