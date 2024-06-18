import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js library

const Visualization: React.FC = () => {
  const [chart, setChart] = useState<Chart | null>(null); // State to hold the Chart.js instance

  // Sample data for chart
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Sales Data',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
      },
    ],
  };

  // Function to create chart
  const createChart = () => {
    if (chart) {
      chart.destroy(); // Destroy existing chart if it exists
    }
    const ctx = document.getElementById('myChart') as HTMLCanvasElement; // Get canvas element
    if (ctx) {
      const newChart = new Chart(ctx, {
        type: 'line', // Chart type (line chart in this case)
        data: chartData, // Data for the chart
      });
      setChart(newChart); // Set the new chart instance to state
    }
  };

  // Effect to create chart on component mount
  useEffect(() => {
    createChart();
    return () => {
      if (chart) {
        chart.destroy(); // Clean up chart instance on unmount
      }
    };
  }, []);

  return (
    <div>
      <h2>Visualization Example</h2>
      <canvas id="myChart" width="400" height="200"></canvas>
    </div>
  );
};

export default Visualization;
