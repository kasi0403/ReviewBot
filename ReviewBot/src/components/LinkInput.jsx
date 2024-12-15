import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LinkInput.css"
import axios from 'axios';
import Loader from './Loader';
import Error from './Error';

const LinkInputPage = ({isLoggedIn,setDetails}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(()=>{
    if(isLoggedIn===false){
      alert("Please login!")
      setTimeout(()=>{
        navigate('/login')
      },1000)
    }
  })

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('token');
        
        if (!token) {
            alert('Please login first!');
            navigate('/login');
            return;
        }
      const response = await axios.post('http://localhost:3001/linkInput', { inputValue },{
        headers: {
            'Authorization': `Bearer ${token}`,  
            'Content-Type': 'application/json',   
        }
    });
      const {productDetails,summary,sentiment,highlights } = response.data;
      setDetails({
        image:productDetails.image,
        name:productDetails.name,
        price:productDetails.price,
        sumRes:summary.summary,
        pos:sentiment.positive,
        neg:sentiment.negative,
        high:highlights
      });
      console.log("Details in frontend:",productDetails,summary,sentiment,highlights);
      
      navigate('/description');
      
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pro-container">
      <div className="content">
        <h2>Product Link</h2>
        <input
          type="text"
          className="input"
          placeholder="Enter a link"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button 
          type="submit"
          className="button"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <br />
        {isLoading && <Loader />}
        <br></br>
        <br></br>
      </div>
    </div>
  );
};

export default LinkInputPage;
