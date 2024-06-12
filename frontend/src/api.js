import axios from 'axios';

const API_BASE_URL = '/api';
import axios from 'axios';

const API_URL = 'http://your-lasr-backend-endpoint'; // Replace with your backend endpoint



export const createProposal = async (proposal) => {
  const response = await axios.post(API_URL, {
    jsonrpc: '2.0',
    method: 'addProposal',
    params: [proposal],
    id: 1,
  });
  return response.data.result;
};

// Function to fetch all proposals
export const fetchProposals = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/proposals`);
    return response.data.proposals;
  } catch (error) {
    throw new Error(`Error fetching proposals: ${error.message}`);
  }
};

// Function to add a new proposal
export const addProposal = async (name, description) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/proposals`, { name, description });
    return response.data;
  } catch (error) {
    throw new Error(`Error adding proposal: ${error.message}`);
  }
};

// Function to cast a vote on a proposal
export const voteOnProposal = async (proposalId, vote) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/proposals/vote`, { proposalId, vote });
    return response.data;
  } catch (error) {
    throw new Error(`Error voting on proposal: ${error.message}`);
  }
};

// Function to fetch voting results
export const fetchResults = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/results`);
    return response.data.results;
  } catch (error) {
    throw new Error(`Error fetching results: ${error.message}`);
  }
};
