import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import Popup from './Popup';

export default function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [popupMessage, setPopupMessage] = useState(null);
    const [popupType, setPopupType] = useState();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', { email, password })
            .then(result => {
                if (result.data.message === "User logged in successfully") {
                    setPopupMessage("Login successful!");
                    setPopupType("success");
                    if (result.data.token) {
                        localStorage.setItem('token', result.data.token); // Store token in localStorage
                        console.log('Token stored in localStorage:', result.data.token);
                        setIsLoggedIn(true); // Update the logged-in state
                    } else {
                        console.error(result.data.error);
                    }
                    setTimeout(() => {
                        setPopupMessage(null);
                        navigate('/');
                    }, 3000);
                } else {
                    setPopupMessage("Login failed. Please check your credentials.");
                    setPopupType("error");
                    setTimeout(() => {
                        setPopupMessage(null);
                    }, 3000);
                }
            })
            .catch(err => {
                console.log(err);
                setPopupMessage("An error occurred. Please try again.");
                setPopupType("error");
                setTimeout(() => {
                    setPopupMessage(null);
                }, 3000);
            });
    };

    return (
        <>
            {popupMessage && <Popup message={popupMessage} type={popupType} />}
            <div className='container'>
                <h1>Login Form</h1>
                {/* <div className='content'> */}
                    <h2>Member Log in</h2>
                    <form className='content' onSubmit={handleSubmit}>
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
                        <button type="submit" className="button">LogIn</button>
                    </form>
                    <p className="text">
                        New Here? <Link to="/register">Register</Link>
                    </p>
                </div>
            {/* </div> */}
        </>
    );
}
