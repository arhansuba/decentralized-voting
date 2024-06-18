import { Request, Response } from 'express';
import DAOService from '../services/DAOService';

class DAOController {
  // Method to create a new proposal
  public async createProposal(req: Request, res: Response): Promise<Response> {
    try {
      const { title, description, options } = req.body;
      if (!title || !description || !options) {
        return res.status(400).json({ message: 'Title, description, and options are required.' });
      }

      const proposal = await DAOService.createProposal(title, description, options);
      return res.status(201).json(proposal);
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

  // Method to vote on a proposal
  public async voteOnProposal(req: Request, res: Response): Promise<Response> {
    try {
      const { proposalId, optionId, voter } = req.body;
      if (!proposalId || !optionId || !voter) {
        return res.status(400).json({ message: 'Proposal ID, option ID, and voter are required.' });
      }

      const vote = await DAOService.voteOnProposal(proposalId, optionId, voter);
      return res.status(200).json(vote);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  // Method to get the result of a proposal
  public async getProposalResult(req: Request, res: Response): Promise<Response> {
    try {
      const { proposalId } = req.params;
      if (!proposalId) {
        return res.status(400).json({ message: 'Proposal ID is required.' });
      }

      const result = await DAOService.getProposalResult(proposalId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
}

export default new DAOController();
