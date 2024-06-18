import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic } from 'antd'; // Import necessary components from Ant Design
import { Line } from '@ant-design/charts'; // Import Line chart from Ant Design Charts
import axios from 'axios'; // Import axios for HTTP requests

const Analytics: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0); // State to store total users
  const [totalTransactions, setTotalTransactions] = useState<number>(0); // State to store total transactions
  const [chartData, setChartData] = useState<any[]>([]); // State to store chart data

  // Example data for line chart
  const lineChartData = [
    { month: 'Jan', value: 500 },
    { month: 'Feb', value: 800 },
    { month: 'Mar', value: 1200 },
    { month: 'Apr', value: 900 },
    { month: 'May', value: 1500 },
    { month: 'Jun', value: 2000 },
    { month: 'Jul', value: 1800 },
    { month: 'Aug', value: 2400 },
    { month: 'Sep', value: 2200 },
    { month: 'Oct', value: 2800 },
    { month: 'Nov', value: 3000 },
    { month: 'Dec', value: 3200 },
  ];

  useEffect(() => {
    // Fetch analytics data from backend API (example)
    axios.get('/api/analytics')
      .then((response) => {
        const { totalUsers, totalTransactions, chartData } = response.data;
        setTotalUsers(totalUsers);
        setTotalTransactions(totalTransactions);
        setChartData(chartData);
      })
      .catch((error) => {
        console.error('Error fetching analytics data:', error);
      });
  }, []);

  const lineChartConfig = {
    data: lineChartData,
    xField: 'month',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    xAxis: {
      label: {
        style: {
          fill: '#aaa',
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: '#aaa',
        },
      },
    },
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Users" value={totalUsers} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Transactions" value={totalTransactions} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Revenue" value={24500.78} precision={2} />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Card>
            <Line {...lineChartConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
