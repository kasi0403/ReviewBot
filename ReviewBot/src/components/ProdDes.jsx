import React from 'react';
import './ProdDes.css';

const ProdDes = ({ details }) => {
  return (
    <div className="outer-container">
      <div className="inner-container">
        <div className="prod-image">
          <img src={details.image} alt={details.name} />
        </div>
        <div className="prod-details">
          <h1 className="prod-title">{details.name}</h1>
          <p className="prod-description">{details.description}</p>
          <p className="prod-price">Price: {details.price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProdDes;
