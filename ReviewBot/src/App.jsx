import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import './bgAnimation.css';  // Make sure this path is correct
import Login from "./components/Login";
import LinkInput from "./components/LinkInput";
import Home from "./components/Home"; // Ensure you import Home
import ProductList from "./components/ProductList";
import Register from "./components/Register";
import axios from "axios";

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

  return (
    <Router>
      <div >
         <BgAnimation /> {/*Ensure this is uncommented */}
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/register" element={<Register/>}/>
            <Route path="/products" element={<ProductList />} />
            <Route path="/link" element={<LinkInput />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
