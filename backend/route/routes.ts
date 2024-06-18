import { Router } from 'express';
import DAOController from './controllers/DAOController';
import VotingController from './controllers/VotingController';

const router = Router();

// DAO routes
router.get('/dao/proposals', DAOController.getAllProposals);
router.get('/dao/proposals/:proposalId', DAOController.getProposalById);
router.post('/dao/proposals/:proposalId/vote', DAOController.voteForProposal);
router.get('/dao/voting-results', DAOController.getVotingResults);

// Voting routes
router.get('/voting/proposals', VotingController.getAllProposals);
router.get('/voting/proposals/:proposalId', VotingController.getProposalById);
router.post('/voting/proposals/:proposalId/vote', VotingController.voteForProposal);
router.get('/voting/voting-results', VotingController.getVotingResults);

export default router;
