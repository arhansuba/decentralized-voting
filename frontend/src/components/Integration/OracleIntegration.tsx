import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert } from 'antd'; // Import necessary components from Ant Design
import { OracleService } from '../../services/OracleService'; // Import your Oracle service

const OracleIntegration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Example: Fetch data from Oracle service
        const response = await OracleService.fetchData(); // Assuming fetchData method in OracleService
        setData(response);
        setError(null);
      } catch (error) {
        setError('Failed to fetch data from Oracle service. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Oracle Integration</h1>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : data ? (
        <Card title="Oracle Data">
          <p>{data}</p>
        </Card>
      ) : null}
    </div>
  );
};

export default OracleIntegration;
