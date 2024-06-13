import express from 'express';
import bodyParser from 'body-parser';
import { VotingProgram } from './voting-system'; // Ensure this path is correct

const app = express();
const port = 3000; // Declare port at the top

app.use(bodyParser.json());

// Initialize VotingProgram with a program balance of 1,000,000 VOTE tokens
const votingProgram = new VotingProgram(1000000);

// Define routes or API endpoints
app.post('/register', (req, res) => {
  const { userAddress } = req.body; // Assuming userAddress is sent in the request body

  const computeInputs = {
    accountInfo: {}, // Placeholder values, replace with actual data
    contractInputs: {}, // Placeholder values, replace with actual data
    op: '', // Placeholder value, replace with actual data
    version: 1, // Placeholder value, replace with actual data
    transaction: {
      from: userAddress
    }
  };

  try {
    const outputs = votingProgram.register(computeInputs);
    res.json({ success: true, outputs });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.post('/addProposal', async (req, res) => {
  try {
    const result = await votingProgram.addProposal(req.body);
    res.json(result);
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/vote', async (req, res) => {
  try {
    const result = await votingProgram.vote(req.body);
    res.json(result);
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/tallyVotes', async (req, res) => {
  try {
    const result = await votingProgram.tallyVotes(req.body);
    res.json(result);
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
