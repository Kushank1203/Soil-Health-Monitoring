import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import Insights from './components/Insights';
import './App.css';

const App = () => {
  const [soilData, setSoilData] = useState([]);

  useEffect(() => {
    // Fetch soil data from the backend
    axios.get('http://localhost:5001/api/data')
      .then(response => setSoilData(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="App">
      <h1>Soil Health Monitoring</h1>
      <Dashboard soilData={soilData} />
      <Insights soilData={soilData} />
    </div>
  );
};

export default App;