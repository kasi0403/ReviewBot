import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LinkInput.css"
import axios from 'axios';
import Loader from './Loader';

const LinkInputPage = ({setDetails}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/linkInput', { inputValue });
      console.log("Received in frontend = ", response.data.reviews);
      const {product_details,reviews} = response.data.reviews; // Assuming `reviews` is an array
      setReviews(reviews);
      setDetails(product_details);
      console.log("frontend prod details = ",product_details)
      // Pass reviews to Description page via props
      navigate('/description');
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
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
