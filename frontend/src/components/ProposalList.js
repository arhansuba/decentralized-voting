import React, { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import './ProposalList.css';

const ProposalList = ({ proposals }) => {
  return (
    <div className="proposal-list">
      <h2>Proposals</h2>
      <ul>
        {proposals.map((proposal, index) => (
          <li key={index}>{proposal}</li>
        ))}
      </ul>
    </div>
  );
};

ProposalList.propTypes = {
  proposals: PropTypes.arrayOf(PropTypes.string).isRequired,
};



const ProposalList = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get('/api/proposals');
        setProposals(response.data.proposals);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  if (loading) {
    return <div>Loading proposals...</div>;
  }

  if (error) {
    return <div>Error loading proposals: {error}</div>;
  }

  return (
    <div>
      <h2>Proposals</h2>
      <ul>
        {proposals.map((proposal) => (
          <li key={proposal.id}>
            <h3>{proposal.name}</h3>
            <p>{proposal.description}</p>
            <p>Votes: {proposal.votes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProposalList;
