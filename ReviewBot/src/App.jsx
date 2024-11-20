import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./components/Navbar";
import './bgAnimation.css'; // Ensure this path is correct
import Login from "./components/Login";
import LinkInput from "./components/LinkInput";
import Home from "./components/Home"; // Ensure you import Home
import ProductList from "./components/ProductList";
import Register from "./components/Register";
import Chatbot from "./components/Chatbot";

const BgAnimation = () => {
  useEffect(() => {
    const bgAnimation = document.getElementById("bgAnimation");
    const numberOfColorBoxes = 400;

    for (let i = 0; i < numberOfColorBoxes; i++) {
      const colorBox = document.createElement("div");
      colorBox.classList.add("colorBox");
      bgAnimation.append(colorBox);
    }
  }, []);

  return <div className="bgAnimation" id="bgAnimation"></div>;
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // User is logged in if token exists
    }
  }, []);

  return (
    <Router>
      <div>
        {/* <BgAnimation />  */}
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route exact path="/register" element={<Register />} />
            {/* <Route path="/products" element={<ProductList />} /> */}
            <Route path="/link" element={<LinkInput />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
