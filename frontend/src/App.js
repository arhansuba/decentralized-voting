import React, { useState, useEffect } from 'react';
import ProposalList from './ProposalList';
import { fetchProposals, createProposal } from './api';
import './App.css';

const App = () => {
  const [proposals, setProposals] = useState([]);
  const [newProposal, setNewProposal] = useState('');

  useEffect(() => {
    const getProposals = async () => {
      const fetchedProposals = await fetchProposals();
      setProposals(fetchedProposals);
    };

    getProposals();
  }, []);

  const handleAddProposal = async () => {
    if (newProposal.trim()) {
      const proposal = await createProposal(newProposal);
      setProposals([...proposals, proposal]);
      setNewProposal('');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Decentralized Voting System</h1>
      </header>
      <main>
        <div className="proposal-input">
          <input
            type="text"
            value={newProposal}
            onChange={(e) => setNewProposal(e.target.value)}
            placeholder="Enter new proposal"
          />
          <button onClick={handleAddProposal}>Add Proposal</button>
        </div>
        <ProposalList proposals={proposals} />
      </main>
    </div>
  );
};

export default App;
