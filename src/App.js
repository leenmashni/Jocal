import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Item from "./pages/Item";
import Wishlist from "./pages/Wishlist";
import Contact from './pages/Contact'; 
import Login from './pages/Login';







const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />


        <Route path="/item/:id" element={<Item />} />
        <Route path="/wishlist" element={<Wishlist />} />

      </Routes>
    </Router>
  );
};

export default App;
