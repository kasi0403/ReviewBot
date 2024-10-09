import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import axios from 'axios';
import Popup from './Popup'; // Import Popup component

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [popupMessage, setPopupMessage] = useState(null); // State to handle popup message
  const [popupType, setPopupType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/register', { name, email, password })
      .then(result => {
        console.log(result);

        if (result.data.message === "User registered successfully") {
          setPopupMessage("Registration successful! Redirecting to login...");
          setPopupType("success");
          setTimeout(() => {
            setPopupMessage(null); // Hide popup after 3 seconds
            navigate('/login');
          }, 3000);
        } else {
          setPopupMessage(result.data.error || "Registration failed. Please try again."); // Use the error message from the response
          setPopupType("error");
          setTimeout(() => {
            setPopupMessage(null); // Hide popup after 3 seconds
          }, 3000);
        }
      })
      .catch(err => {
        // Log the error for further analysis
        console.error(err.response.data); // Print the full error response to the console
        // Display the specific error message from the response if available
        setPopupMessage(err.response?.data?.error || "An error occurred. Please try again."); // Handle specific error messages
        setPopupType("error");
        setTimeout(() => {
          setPopupMessage(null); // Hide popup after 3 seconds
        }, 3000);
      });
};

  

  return (
    <>
      {popupMessage && <Popup message={popupMessage} type={popupType} />} {/* Popup outside of container */}
      <div className='container'>
        <h1>Register Form</h1>
        <div className='content'>
          <h2>Create Account</h2>
          <form className='content' onSubmit={handleSubmit}>
            <input
              type="text"
              className="input"
              autoComplete="off"
              placeholder='Username'
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              className="input"
              autoComplete="off"
              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="input"
              autoComplete="off"
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="button">Register</button>
          </form>
          <p className="text">
            Already have an account? <Link to="/login">LogIn</Link>
          </p>
        </div>
      </div>
    </>
  );
}
