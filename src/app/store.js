// IMPORTS -->
  //RTK
import { configureStore } from "@reduxjs/toolkit";
  //Redux Persist
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
    //Slicer
import cartReducer from "../features/cart/cartSlicer";



// Declare persistConfig object to configure behaviour of redux-persist library. 
const persistConfig = {
  key: 'root', //unique identificator for persisted state 
  storage: storage, //storage engine
  
}

// Initialize persisted reducer, which will keep our currencySymbol state on refresh
const persistedReducer = persistReducer(persistConfig, cartReducer);

// Configure our redux store via configureStore() API
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',

})

//Create a persistable version of Redux store. 
//State automaticaly will be saved and rehydrated (restore previous version of state after refresh, closing etc.) from store on app start.
export const persistor = persistStore(store);

