import React from "react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

const Nav = () => {

  const {cartItems }= useCart()

  return (
    <div className="navbar-section">

      <div className="navSection">
      <Link to='/' className="custom-link">
      <div className="title">
    <h2>CHAT BOT</h2>
  </div>
</Link>

</div>        
</div>
  );
};

export default Nav;
