import { Request, Response } from 'express';
import VotingService from '../services/VotingService';

class VotingController {
  // Method to create a new voting session
  public async createVotingSession(req: Request, res: Response): Promise<Response> {
    try {
      const { title, options, startTime, endTime } = req.body;
      if (!title || !options || !startTime || !endTime) {
        return res.status(400).json({ message: 'Title, options, startTime, and endTime are required.' });
      }

      const votingSession = VotingService.createVotingSession(title, options, startTime, endTime);
      return res.status(201).json(votingSession);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  // Method to get all voting sessions
  public async getVotingSessions(req: Request, res: Response): Promise<Response> {
    try {
      const votingSessions = VotingService.getVotingSessions();
      return res.status(200).json(votingSessions);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  // Method to vote in a voting session
  public async vote(req: Request, res: Response): Promise<Response> {
    try {
      const { votingSessionId, optionId, voter } = req.body;
      if (!votingSessionId || !optionId || !voter) {
        return res.status(400).json({ message: 'Voting session ID, option ID, and voter are required.' });
      }

      const vote = VotingService.vote(votingSessionId, optionId, voter);
      return res.status(200).json(vote);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  // Method to get the result of a voting session
  public async getVotingResult(req: Request, res: Response): Promise<Response> {
    try {
      const { votingSessionId } = req.params;
      if (!votingSessionId) {
        return res.status(400).json({ message: 'Voting session ID is required.' });
      }

      const result = VotingService.getVotingResult(votingSessionId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
}

export default new VotingController();
