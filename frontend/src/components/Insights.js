import React, { useState } from 'react';
import axios from 'axios';

const Insights = ({ soilData }) => {
  const [insights, setInsights] = useState(null);
  const [cropPrediction, setCropPrediction] = useState(null);
  const [error, setError] = useState(null);

  // Validate transformed data
  const validateData = (data) => {
    const { ph, humidity, temperature, nitrogen, phosphorus, potassium, rainfall } = data;

    if (ph < 0 || ph > 14) {
      throw new Error('pH must be between 0 and 14.');
    }
    if (humidity < 0 || humidity > 100) {
      throw new Error('Humidity must be between 0 and 100.');
    }
    if (temperature < -50 || temperature > 50) {
      throw new Error('Temperature must be between -50 and 50°C.');
    }
    if (nitrogen < 0 || nitrogen > 100) {
      throw new Error('Nitrogen must be between 0 and 100.');
    }
    if (phosphorus < 0 || phosphorus > 100) {
      throw new Error('Phosphorus must be between 0 and 100.');
    }
    if (potassium < 0 || potassium > 100) {
      throw new Error('Potassium must be between 0 and 100.');
    }
    if (rainfall < 0 || rainfall > 200) {
      throw new Error('Rainfall must be between 0 and 200 mm.');
    }
  };

  const fetchInsights = async () => {
    try {
      // Use the latest soil data
      const latestData = soilData[0];
      console.log("Raw soil data:", latestData);

      // Transform the array into an object with the correct keys
      const transformedData = {
        ph: latestData[2],
        humidity: latestData[3],
        temperature: latestData[4],
        nitrogen: latestData[5],
        phosphorus: latestData[6],
        potassium: latestData[7],
        rainfall: latestData[8],
      };
      console.log("Transformed data:", transformedData);

      // Validate the transformed data
      validateData(transformedData);

      // Fetch insights from /api/insights
      const insightsResponse = await axios.post(
        'http://localhost:5001/api/insights',
        transformedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Response from /api/insights:", insightsResponse.data);
      setInsights(insightsResponse.data);

      // Fetch crop prediction from /predict
      const cropResponse = await axios.post(
        'http://localhost:5001/predict',
        transformedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Response from /predict:", cropResponse.data);
      setCropPrediction(cropResponse.data);

      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching insights:", error);
      setError(error.message || "Failed to fetch insights. Please try again.");
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