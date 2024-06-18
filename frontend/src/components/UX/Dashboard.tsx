import React from 'react';
import { Card, Col, Row, Statistic } from 'antd'; // Import necessary components from Ant Design

const Dashboard: React.FC = () => {
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Active Users" value={112893} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Transactions" value={2345} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Revenue (USD)" value={345678} precision={2} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="Recent Transactions">
            <p>Transaction 1</p>
            <p>Transaction 2</p>
            <p>Transaction 3</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="System Status">
            <p>Server uptime: 98%</p>
            <p>Database usage: 50%</p>
            <p>Network traffic: Normal</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
