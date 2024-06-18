import { Request, Response } from 'express';
import DAOService from '../services/DAOService';
import VotingService from '../services/VotingService';

class GovernanceController {
  // Method to create a new proposal
  public async createProposal(req: Request, res: Response): Promise<Response> {
    try {
      const { proposalId, description } = req.body;
      if (!proposalId || !description) {
        return res.status(400).json({ message: 'Proposal ID and description are required.' });
      }

      const proposal = await DAOService.createProposal(proposalId, description);
      return res.status(201).json(proposal);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  // Method to vote on a proposal
  public async voteOnProposal(req: Request, res: Response): Promise<Response> {
    try {
      const { proposalId, voterId, weight } = req.body;
      if (!proposalId || !voterId || !weight) {
        return res.status(400).json({ message: 'Proposal ID, Voter ID, and weight are required.' });
      }

      const vote = await VotingService.voteOnProposal(proposalId, voterId, weight);
      return res.status(200).json(vote);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  // Method to tally votes for a proposal
  public async tallyVotes(req: Request, res: Response): Promise<Response> {
    try {
      const { proposalId } = req.params;
      if (!proposalId) {
        return res.status(400).json({ message: 'Proposal ID is required.' });
      }

      const tally = await VotingService.tallyVotes(proposalId);
      return res.status(200).json(tally);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  // Method to get all proposals
  public async getProposals(req: Request, res: Response): Promise<Response> {
    try {
      const proposals = await DAOService.getProposals();
      return res.status(200).json(proposals);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  // Method to get a specific proposal
  public async getProposal(req: Request, res: Response): Promise<Response> {
    try {
      const { proposalId } = req.params;
      if (!proposalId) {
        return res.status(400).json({ message: 'Proposal ID is required.' });
      }

      const proposal = await DAOService.getProposal(proposalId);
      return res.status(200).json(proposal);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
}

export default new GovernanceController();
