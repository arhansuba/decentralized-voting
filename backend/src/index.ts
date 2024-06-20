import express from 'express';
import bodyParser from 'body-parser';
import { VotingProgram } from './voting-system'; // Ensure this path is correct
import { IComputeInputs , Address} from '@versatus/versatus-javascript';

//import { IComputeInputs } from './types'; // Assuming you have a types file for interfaces


const computeInputs: IComputeInputs = {
  accountInfo: {
    accountType: {
      Program: "0x57234c52617e7ca8edc5577ebe3eb38d53a77607"
    },
    nonce: "0x000000000000000000000000000000000000000000000000000000000000001c",
    ownerAddress: "0x482830d7655fb8465a43844fc1530a7713781b49" as unknown as Address,
    programAccountData: {},
    programAccountMetadata: {},
    programAccountLinkedPrograms: [],
    programs: {}
  },
  contractInputs: JSON.stringify({}),
  op: "create",
  version: 1,
  transaction: {
    from: "0x100444c7D04A842D19bc3eE63cB7b96682FF3f43",
    to: "0x100444c7D04A842D19bc3eE63cB7b96682FF3f43",
    transactionInputs: "{\"name\":\"HelloToken\",\"symbol\":\"HLLO\",\"totalSupply\":\"1\",\"initializedSupply\":\"1\"}",
    nonce: "0x0000000000000000000000000000000000000000000000000000000000000001",
    op: "create",
    programId: "0x100444c7D04A842D19bc3eE63cB7b96682FF3f43",
    r: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    s: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    v: 1,
    transactionType: {
      call: "0x0000000000000000000000000000000000000000000000000000000000000001"
    },
    value: "0x0000000000000000000000000000000000000000000000000000000000000001"
  }
};

const votingProgram = new VotingProgram(1000000);
const outputs = votingProgram.register(computeInputs);
console.log(outputs);

const app = express();
const port = 3000; // Declare port at the top

app.use(bodyParser.json());



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
