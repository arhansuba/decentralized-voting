import { Versatus, Context, ContractFunction } from '@versatus/versatus-javascript';

interface Candidate {
  id: string;
  name: string;
  votes: number;
}

interface Vote {
  voterId: string;
  candidateId: string;
}

interface VotingState {
  candidates: Candidate[];
  votes: Vote[];
  voters: string[];
}

// Initialize the voting state
const initialState: VotingState = {
  candidates: [],
  votes: [],
  voters: []
};

const program = new Versatus.Program<VotingState>('VotingSystem', initialState);

program.function('registerCandidate', (context: Context, name: string): void => {
  const { state } = context;

  // Generate a unique candidate ID
  const candidateId = `candidate_${state.candidates.length + 1}`;

  // Add the new candidate
  state.candidates.push({ id: candidateId, name, votes: 0 });

  console.log(\`Candidate \${name} registered with ID: \${candidateId}\`);
});

program.function('vote', (context: Context, voterId: string, candidateId: string): void => {
  const { state } = context;

  // Check if the voter has already voted
  if (state.voters.includes(voterId)) {
    throw new Error('Voter has already voted');
  }

  // Find the candidate
  const candidate = state.candidates.find(c => c.id === candidateId);
  if (!candidate) {
    throw new Error('Candidate not found');
  }

  // Record the vote
  state.votes.push({ voterId, candidateId });
  candidate.votes += 1;

  // Mark the voter as having voted
  state.voters.push(voterId);

  console.log(\`Vote recorded for candidate: \${candidate.name} by voter: \${voterId}\`);
});

program.function('getResults', (context: Context): Candidate[] => {
  const { state } = context;
  // Return the current vote counts for each candidate
  return state.candidates;
});

export default program;