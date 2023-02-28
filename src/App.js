// IMPORTS -->
  // React, React Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
  // Components
import NavBar from './components/NavBar';
import ProductListPage from './components/pages/ProductListPage';
import ProductDetailsPage from './components/pages/ProductDetailsPage';
import CartPage from './components/pages/CartPage';
  // Style
import './App.css';

// COMPONENTS -->
function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path=':category' element={<ProductListPage />} />
        <Route path=':category/product/:productID' element={<ProductDetailsPage />} />
        <Route path='cart' element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
