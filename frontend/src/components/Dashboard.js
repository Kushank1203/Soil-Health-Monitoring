import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [soilData, setSoilData] = useState([]);
  const [range, setRange] = useState('today');

  // Function to fetch data from an API
  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/data');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setSoilData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]); // Fetch data when the range changes

  const filterData = () => {
    const now = new Date(); 
    let startDate = new Date();

    if (range === 'today') {
      startDate = new Date(now.toISOString().split('T')[0]);
    } else if (range === '1') {
      startDate.setUTCDate(now.getUTCDate() - 1);
    } else if (range === '7') {
      startDate.setUTCDate(now.getUTCDate() - 7);
    } else if (range === '30') {
      startDate.setUTCMonth(now.getUTCMonth() - 1);
    }

    let startUTC = new Date(startDate.toISOString());
    let nowUTC = new Date(now.toISOString());

    const filtered = soilData.filter((d) => {
      if (!d.timestamp) return false;
      let dateUTC = new Date(d.timestamp);
      if (isNaN(dateUTC.getTime())) return false;
      return dateUTC >= startUTC && dateUTC <= nowUTC;
    });

    return filtered;
  };

  const filteredData = filterData();

  const data = {
    labels: filteredData.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'pH',
        data: filteredData.map(d => d.ph),
        borderColor: 'red',
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
      },
      {
        label: 'Humidity',
        data: filteredData.map(d => d.humidity),
        borderColor: 'blue',
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
      },
      {
        label: 'Rainfall',
        data: filteredData.map(d => d.rainfall),
        borderColor: 'yellow',
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
      },
      {
        label: 'Temperature',
        data: filteredData.map(d => d.temperature),
        borderColor: 'green',
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
      },
      {
        label: 'Nitrogen',
        data: filteredData.map(d => d.nitrogen),
        borderColor: 'purple',
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
      },
      {
        label: 'Phosphorus',
        data: filteredData.map(d => d.phosphorus),
        borderColor: 'orange',
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
      },
      {
        label: 'Potassium',
        data: filteredData.map(d => d.potassium),
        borderColor: 'brown',
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>Real-Time Soil Data</h2>
      
      {/* Range Selection Dropdown */}
      <div style={{ marginBottom: '20px' }}>
        <label>Select Date Range: </label>
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="today">Today</option>
          <option value="1">Last 1 Day</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 1 Month</option>
        </select>
      </div>

      {/* Conditional Rendering */}
      {filteredData.length > 0 ? (
        <Line data={data} />
      ) : (
        <p>No valid data available for the selected range.</p>
      )}
    </div>
  );
};

export default Dashboard;
