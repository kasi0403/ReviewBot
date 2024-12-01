import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
import Success from './Success';
import Error from './Error';

export default function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', { email, password })
            .then(result => {
                if (result.data.message === "User logged in successfully") {
                    setShowSuccess(true);
                    setIsLoggedIn(true)
                    setTimeout(() => {
                        setShowSuccess(false);
                        navigate('/');
                    }, 3500);
                } else {
                    setShowError(true);
                    setTimeout(() => {
                        setShowError(false);
                    }, 3500);
                }
            })
            .catch(err => {
                console.log(err);
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 3500);
            });
    };

    return (
        <>
            {showSuccess && <Success />}
            {showError && <Error />}

            <div className='container'>
                <form className='content' onSubmit={handleSubmit}>
                <div className='head'>Login Form</div>
                <h1>Member Log in</h1>
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
        </>
    );
}
