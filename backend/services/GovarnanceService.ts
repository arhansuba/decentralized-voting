interface Proposal {
    id: number;
    title: string;
    description: string;
    options: string[];
    startTime: Date;
    endTime: Date;
    votes: Record<string, number>;
    status: 'active' | 'closed';
  }
  
  class GovernanceService {
    private proposals: Proposal[] = [];
  
    // Method to create a new proposal
    public async createProposal(title: string, description: string, options: string[], startTime: Date, endTime: Date): Promise<Proposal> {
      const proposal: Proposal = {
        id: this.proposals.length + 1,
        title,
        description,
        options,
        startTime,
        endTime,
        votes: {},
        status: 'active'
      };
      this.proposals.push(proposal);
      return proposal;
    }
  
    // Method to get all proposals
    public async getProposals(): Promise<Proposal[]> {
      return this.proposals;
    }
  
    // Method to vote on a proposal
    public async vote(proposalId: number, optionId: number, voter: string): Promise<void> {
      const proposal = this.proposals.find(p => p.id === proposalId);
      if (!proposal) throw new Error('Proposal not found');
  
      if (proposal.status !== 'active') throw new Error('Proposal is not active');
  
      if (!proposal.votes[voter]) {
        proposal.votes[voter] = optionId;
      } else {
        throw new Error('Voter has already voted');
      }
    }
  
    // Method to get the result of a proposal
    public async getProposalResult(proposalId: number): Promise<any> {
      const proposal = this.proposals.find(p => p.id === proposalId);
      if (!proposal) throw new Error('Proposal not found');
  
      const result = proposal.options.map((option, index) => {
        const voteCount = Object.values(proposal.votes).filter(vote => vote === index).length;
        return { option, voteCount };
      });
  
      return result;
    }
  
    // Method to close a proposal
    public async closeProposal(proposalId: number): Promise<void> {
      const proposal = this.proposals.find(p => p.id === proposalId);
      if (!proposal) throw new Error('Proposal not found');
  
      proposal.status = 'closed';
    }
  }
  
  export default new GovernanceService();
  