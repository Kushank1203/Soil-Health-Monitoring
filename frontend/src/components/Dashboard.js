import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = ({ soilData }) => {
  const data = {
    labels: soilData.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'pH',
        data: soilData.map(d => d.ph),
        borderColor: 'red',
      },
      {
        label: 'Humidity',
        data: soilData.map(d => d.humidity),
        borderColor: 'blue',
      },
      {
        label: 'Rainfall',
        data: soilData.map(d => d.rainfall),
        borderColor: 'yellow',
      },
      {
        label: 'Temperature',
        data: soilData.map(d => d.temperature),
        borderColor: 'green',
      },
    ],
  };

  return (
    <div>
      <h2>Real-Time Soil Data</h2>
      <Line data={data} />
    </div>
  );
};

export default Dashboard;