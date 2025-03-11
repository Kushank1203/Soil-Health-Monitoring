import React, { useState } from 'react';
import axios from 'axios';

const Insights = ({ soilData }) => {
  const [insights, setInsights] = useState(null);
  const [cropPrediction, setCropPrediction] = useState(null);

  const fetchInsights = async () => {
    try {
      const latestData = soilData[0]; // Use the latest soil data

      // Fetch insights
      const insightsResponse = await axios.post('http://localhost:5001/api/insights', latestData);
      setInsights(insightsResponse.data);

      // Fetch crop prediction
      const cropResponse = await axios.post('http://localhost:5001/predict', latestData);
      setCropPrediction(cropResponse.data);
    } catch (error) {
      console.error("Error fetching insights:", error);
    }
  };

  return (
    <div>
      <h2>AI-Based Insights</h2>
      <button onClick={fetchInsights}>Get Insights</button>
      {insights && (
        <div>
          <h3>Soil Insights</h3>
          <p>Predicted Yield: {insights.predicted_yield}</p>
          <p>Recommendation: {insights.recommendation}</p>
        </div>
      )}
      {cropPrediction && (
        <div>
          <h3>Crop Prediction</h3>
          <p>Soil Health: {cropPrediction["Soil Health"]}</p>
          <p>Recommended Crop: {cropPrediction["Recommended Crop"]}</p>
        </div>
      )}
    </div>
  );
};

export default Insights;