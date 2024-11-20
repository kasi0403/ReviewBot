import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LinkInput.css"

const LinkInputPage = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit=()=>{
    
    navigate("/chatbot", { state: { link: inputValue } });
  }

  return (
    <div className="container">
      <div className="content">
        <h2>Link Input</h2>
        <input
          type="text"
          className="input"
          placeholder="Enter a link"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button 
          type="submit"
          className='button'
          onClick={handleSubmit}
        >Submit</button>
      </div>
    </div>
  );
};

export default LinkInputPage;
