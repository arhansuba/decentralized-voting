import express from 'express';
import bodyParser from 'body-parser';
//import { VotingProgram } from './voting-system'; // Ensure this path is correct
import {VotingProgram} from './voting-system';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/create', async (req, res) => {
  try {
    const votingProgram = new VotingProgram();
    const result = await votingProgram.create(req.body);
    res.json(result);
  } catch (error) {
    console.error((error as Error).message); // Cast to Error type
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/addProposal', async (req, res) => {
  try {
    const votingProgram = new VotingProgram();
    const result = await votingProgram.addProposal(req.body);
    res.json(result);
  } catch (error) {
    console.error((error as Error).message); // Cast to Error type
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/vote', async (req, res) => {
  try {
    const votingProgram = new VotingProgram();
    const result = await votingProgram.vote(req.body);
    res.json(result);
  } catch (error) {
    console.error((error as Error).message); // Cast to Error type
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/tallyVotes', async (req, res) => {
  try {
    const votingProgram = new VotingProgram();
    const result = await votingProgram.tallyVotes(req.body);
    res.json(result);
  } catch (error) {
    console.error((error as Error).message); // Cast to Error type
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
