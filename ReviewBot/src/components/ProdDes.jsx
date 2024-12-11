import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart } from '@mui/x-charts/PieChart'; // Importing the PieChart component
import Loader from './Loader';
import './ProdDes.css';

const ProdDes = ({ details }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [sentimentResults, setSentimentResults] = useState(null);
  const [pos, setPos] = useState(0);
  const [neg, setNeg] = useState(0);
  const [high, setHigh] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [sumRes, setSumRes] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (details && details.details) {
      setProductDetails(details.details);
    }
  }, [details]);

  useEffect(() => {
    if (details.highlights) {
      setHigh(details.highlights);
    }
  }, [details.highlights]);

  useEffect(() => {
    if (details.reviews && details.reviews.length > 0) {
      handleAnalysis();
    }
  }, [details.reviews]);

  const handleAnalysis = async () => {
    try {
      const response = await axios.post('http://localhost:3001/analyzeSentiment', { reviews: details.reviews });
      setSentimentResults(response.data);
      setPos(response.data.positive);
      setNeg(response.data.negative);
      const para = await axios.post('http://localhost:3001/summarize', { reviews: details.reviews });
      setSumRes(para.data);
    } catch (error) {
      console.error("Error during sentiment analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    series: [
      {
        data: [
          { id: 0, value: pos, label: 'Positive' },
          { id: 1, value: neg, label: 'Negative' },
        ],
      },
    ],
  };

  if (!productDetails) {
    return <p>Loading product details...</p>;
  }

  return(
    <div className="prod-container">
      <div className="prod-wrapper">
        <div className="prod-card">
          {/* Main Product Section */}
          <div className="prod-main">
            <div className="prod-image-container">
              <img
                src={productDetails.image}
                alt={productDetails.name}
                className="prod-image"
              />
            </div>

            <div className="prod-info">
              <h1 className="prod-title">{productDetails.name}</h1>
              <div className="prod-price">{productDetails.price}</div>
              <div className="prod-highlights">
                {high && Array.isArray(high) && high.map((text, index) => (
                  <div key={index} className="prod-highlight-text">
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Section */}
          <div className="prod-summary-section">
            {sumRes && sentimentResults && (
              <div className="prod-summary-wrapper">
                <div className="prod-summary">
                  <h2>Product Summary</h2>
                  <p>{sumRes.summary}</p>
                </div>
                <div className="prod-sentiment-container">
                <h2 className="prod-sentiment-title">Customer Sentiment</h2>
                  <div className="prod-sentiment-chart">
                    {/* Sentiment Pie Chart */}
                    <PieChart
                      series={chartData.series}
                      width={400}
                      height={200}
                    />
                  </div>
                </div>
              </div>
            )}

            {Loading && <Loader />}

            {/* Chatbot Section */}
            <div className="prod-chatbot-section">
              <h2 className="prod-chatbot-title">Product Assistant</h2>
              <div className="prod-chatbot-wrapper">
                <div className="prod-chatbot-messages">
                  <div className="bg-blue-100 p-3 inline-block rounded-lg">Hello! How can I help you today?</div>
                </div>
                <div className="prod-chatbot-input">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                  />
                  <button>Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdDes;
