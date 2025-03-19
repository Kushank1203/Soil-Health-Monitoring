import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Insights from './components/Insights';
import Dashboard from './components/Dashboard';
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
      <Insights soilData={soilData} />
      <Dashboard soilData = {soilData} />
    </div>
  );
};

export default App;