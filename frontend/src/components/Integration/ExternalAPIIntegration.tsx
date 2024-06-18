import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios for API requests
import { Card, Spin, Alert } from 'antd'; // Import necessary components from Ant Design

const ExternalAPIIntegration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Example: Fetch data from an external API (replace with your actual API endpoint)
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
        setData(response.data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>External API Integration</h1>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : data ? (
        <Card title="External API Data">
          <p><strong>Title:</strong> {data.title}</p>
          <p><strong>Body:</strong> {data.body}</p>
        </Card>
      ) : null}
    </div>
  );
};

export default ExternalAPIIntegration;
