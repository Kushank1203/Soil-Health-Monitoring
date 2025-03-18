import React, { useState } from 'react';
import axios from 'axios';

const Insights = ({ soilData }) => {
  const [insights, setInsights] = useState(null);
  const [cropPrediction, setCropPrediction] = useState(null);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    try {
      const latestData = soilData[0]; // Use the latest soil data
      console.log("Sending data to /api/insights:", latestData);

      // Fetch insights with correct headers and JSON payload
      const insightsResponse = await axios.post(
        'http://localhost:5001/api/insights',
        JSON.stringify(latestData), // Convert to JSON string
        {
          headers: {
            'Content-Type': 'application/json', // Add this header
          },
        }
      );
      console.log("Response from /api/insights:", insightsResponse.data);
      setInsights(insightsResponse.data);

      // Fetch crop prediction with correct headers and JSON payload
      const cropResponse = await axios.post(
        'http://localhost:5001/predict',
        JSON.stringify(latestData), // Convert to JSON string
        {
          headers: {
            'Content-Type': 'application/json', // Add this header
          },
        }
      );
      console.log("Response from /predict:", cropResponse.data);
      setCropPrediction(cropResponse.data);

      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching insights:", error);
      setError("Failed to fetch insights. Please try again.");
    }
  };

  return (
    <div>
      <h2>AI-Based Insights</h2>
      <button onClick={fetchInsights}>Get Insights</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
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