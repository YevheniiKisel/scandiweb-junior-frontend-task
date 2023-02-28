// IMPORTS -->
  //React, React Router
import React from 'react';
import ReactDOM from 'react-dom/client';
  //React Redux, Redux Toolkit, Redux Persist
import { store, persistor } from './app/store';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
  //Apollo Client
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";  
  //Visual content,
import './style/main.css';
import App from './App';


// INITIALIZE APOLLO CLIENT -->
const client = new ApolloClient({
  // Our GraphQL server adress
  uri: "http://localhost:4000/",
  // To save fetched data in cache, thus better performance
  cache: new InMemoryCache()
})


// RENDER -->
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Wrap our entire app inside Apollo Client, in order to get access to the client from any point of app
  // Wrap our App component inside Provider component in order to get access to the global states (redux store) from any point of app
  <ApolloProvider client={client} >
    <Provider store={store} >
      <PersistGate persistor={persistor}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </PersistGate>
    </Provider>
  </ApolloProvider>
);

