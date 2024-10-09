import React from 'react';
import { useLocation } from 'react-router-dom';

const Chatbot = () => {
  const location = useLocation();
  const { link } = location.state; // Use optional chaining to prevent errors if state is undefined

  // Now you can use 'link' to make calls to your models
  // review summary(have to make a call to the DL model from frontend)
  // average rating of the product(from webscraping script)
  // pros and cons(from another model)
  // finally the RAG chatbot container

  return (
    <div className='container'>
      <h1>Chatbot</h1>
      {link && <p>Link provided: {link}</p>}
      {/* Your other components for review summary, rating, pros and cons, etc. */}
    </div>
  );
};

export default Chatbot;
