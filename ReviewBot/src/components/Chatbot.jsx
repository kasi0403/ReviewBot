import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const ChatbotPage = () => {
  const location = useLocation();
  const { link } = location.state || {};  // Getting the link passed from the LinkInputPage

  const [reviews, setReviews] = useState([]);
  const [positiveCount, setPositiveCount] = useState(0);
  const [negativeCount, setNegativeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Function to fetch reviews and perform sentiment analysis
  const fetchReviewsAndAnalyzeSentiment = async () => {
    try {
      setLoading(true);

      // Step 1: Scrape reviews from the link
      const reviewsResponse = await axios.get('http://localhost:5000/linkInput', { params: { link } });
      const reviews = reviewsResponse.data.reviews;

      // Step 2: Perform sentiment analysis on the reviews
      const sentimentResponse = await axios.post('http://localhost:5000/analyzeSentiment', { reviews });

      // Step 3: Update sentiment counts
      setPositiveCount(sentimentResponse.data.positiveCount);
      setNegativeCount(sentimentResponse.data.negativeCount);
    } catch (error) {
      console.error("Error fetching reviews or analyzing sentiment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    if (link) {
      fetchReviewsAndAnalyzeSentiment();
    }
  }, [link]);

  const data = {
    labels: ['Positive', 'Negative'],
    datasets: [
      {
        label: 'Sentiment Distribution',
        data: [positiveCount, negativeCount],
        backgroundColor: ['#4CAF50', '#F44336'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="container">
      <div className="content">
        <h2>Chatbot: Sentiment Analysis</h2>
        
        {loading ? (
          <p>Loading sentiment analysis...</p>
        ) : (
          <div>
            <h3>Sentiment Distribution for Reviews</h3>
            <Pie data={data} />
            <div className="sentiment-summary">
              <p>Positive Sentiments: {positiveCount}</p>
              <p>Negative Sentiments: {negativeCount}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotPage;
