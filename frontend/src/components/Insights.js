import React, { useState } from 'react';
import axios from 'axios';

const Insights = ({ soilData }) => {
  const [insights, setInsights] = useState(null);

  const fetchInsights = () => {
    const latestData = soilData[0];
    axios.post('http://localhost:5001/api/insights', latestData)
      .then(response => setInsights(response.data))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>AI-Based Insights</h2>
      <button onClick={fetchInsights}>Get Insights</button>
      {insights && (
        <div>
          <p>Predicted Yield: {insights.predicted_yield}</p>
          <p>Recommendation: {insights.recommendation}</p>
        </div>
      )}
    </div>
  );
};

export default Insights;