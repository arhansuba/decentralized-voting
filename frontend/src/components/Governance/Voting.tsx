import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd'; // Import necessary components from Ant Design
import { castVote } from '../../services/VotingService'; // Import Voting service function

interface VoteForm {
  proposalId: string;
}

const Voting: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // Form submission handler
  const handleFormSubmit = async (values: VoteForm) => {
    setLoading(true);
    try {
      // Call Voting service function to cast a vote
      await castVote(values.proposalId);
      message.success('Vote cast successfully!');
    } catch (error) {
      message.error('Failed to cast vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Voting Component</h1>
      <Form
        name="vote_form"
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <Form.Item
          name="proposalId"
          label="Proposal ID"
          rules={[
            { required: true, message: 'Please enter the proposal ID' },
          ]}
        >
          <Input placeholder="Enter proposal ID" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cast Vote
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Voting;
