import React from 'react';
import { Card, List, Typography } from 'antd'; // Import necessary components from Ant Design

const { Title } = Typography;

const BugBounty: React.FC = () => {
  // Example data for bug reports
  const bugReports = [
    {
      id: 1,
      title: 'Critical Vulnerability in Authentication',
      description: 'Authentication process does not properly validate user credentials.',
      reward: '1000 USD',
    },
    {
      id: 2,
      title: 'SQL Injection in User Profile Update',
      description: 'User profile update endpoint susceptible to SQL injection attacks.',
      reward: '500 USD',
    },
    {
      id: 3,
      title: 'Cross-Site Scripting (XSS) in Dashboard',
      description: 'Dashboard module allows execution of arbitrary JavaScript code.',
      reward: '300 USD',
    },
  ];

  return (
    <div>
      <Title level={2}>Bug Bounty Program</Title>
      <Card>
        <List
          itemLayout="vertical"
          dataSource={bugReports}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                title={<a href={`/bug/${item.id}`}>{item.title}</a>}
                description={item.description}
              />
              <div>Reward: {item.reward}</div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default BugBounty;
