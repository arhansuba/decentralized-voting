import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd'; // Import necessary components from Ant Design
import { createProposal } from '../../services/DAOService'; // Import DAO service function

interface ProposalForm {
  proposalId: string;
  proposalDescription: string;
}

const DAO: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // Form submission handler
  const handleFormSubmit = async (values: ProposalForm) => {
    setLoading(true);
    try {
      // Call DAO service function to create a proposal
      await createProposal(values.proposalId, values.proposalDescription);
      message.success('Proposal created successfully!');
    } catch (error) {
      message.error('Failed to create proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>DAO Component</h1>
      <Form
        name="proposal_form"
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

        <Form.Item
          name="proposalDescription"
          label="Proposal Description"
          rules={[
            { required: true, message: 'Please enter the proposal description' },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Enter proposal description" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Proposal
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DAO;
