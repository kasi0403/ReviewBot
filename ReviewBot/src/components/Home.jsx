import React, { useRef } from "react";
import "./Home.css"; // Ensure correct path for your CSS file

const Home = () => {
  const secondHomeRef = useRef(null);

  const handleClick = () => {
    secondHomeRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className="home-container">
        <div className="image-section"></div> {/* Left image */}
        <div className="text-section">
          <h1>Explore AzBot</h1>
          <p>Your Virtual Product Assistant</p>
          <button className="discover-btn" onClick={handleClick}>Discover More</button>
        </div>
      </div>
      
      {/* New Section with Waves */}
      <div className="second-home" ref={secondHomeRef}>
        <div>
          <h2>Your Next Generation Product Helper</h2>
          <p>Powered by AI to assist your product discovery journey</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
