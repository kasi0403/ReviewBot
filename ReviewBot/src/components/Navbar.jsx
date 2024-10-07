import React from 'react'
import {Link} from "react-router-dom"
import "./Navbar.css"

function Navbar() {
  return (
    <header className="header">
      <Link to="/" className="logo">Logo</Link>
      <nav className='navbar'>
        <Link to="/products">Products</Link>
        <Link to="/link">Link Insigts</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  )
}

export default Navbar