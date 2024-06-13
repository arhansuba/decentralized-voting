// src/voting-system.ts

import {
  Program,
  IComputeInputs,
  Outputs,
  TokenOrProgramUpdate,
  AddressOrNamespace,
  TokenUpdate,
  buildUpdateInstruction,
  buildTokenUpdateField,
  validateAndCreateJsonString,
  parseTxInputs,
  THIS,
  validate,
  buildTransferInstruction
} from '@versatus/versatus-javascript';

export class VotingProgram extends Program {
  private programBalance: number; // Total tokens allocated to the program

  constructor(programBalance: number) {
    super();
    this.programBalance = programBalance;
  }

  register(computeInputs: IComputeInputs) {
    try {
      const { transaction } = computeInputs;
      const { from } = transaction;

      // Allocate tokens to the voter upon registration
      const voterTokens = 1000; // Example: Each voter gets 1000 tokens upon registration

      // Update the token balance in the program
      this.programBalance -= voterTokens;

      // Validate and retrieve current token data
      const currProgramInfo = validate(
        computeInputs.accountInfo?.programs[transaction.to],
        'Token information not found.'
      );

      const tokenData = validate(
        currProgramInfo?.data,
        'Token data is missing.'
      );

      // Parse existing voters or initialize an empty object
      const currentVoters = JSON.parse(tokenData.voters || '{}');

      // Add the new voter to the list with initial token balance
      currentVoters[from] = voterTokens;

      // Prepare updated token data
      const updatedTokenData = {
        ...tokenData,
        voters: JSON.stringify(currentVoters)
      };

      // Create JSON string from updated token data
      const updatedTokenDataStr = validateAndCreateJsonString(updatedTokenData);

      // Build token update field
      const updateTokenField = buildTokenUpdateField({
        field: 'data',
        value: updatedTokenDataStr,
        action: 'extend'
      });

      // Build token update instruction
      const updateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'tokenUpdate',
          new TokenUpdate(
            new AddressOrNamespace(transaction.to), // Program's address
            new AddressOrNamespace(THIS), // This program's address
            [updateTokenField]
          )
        )
      });

      // Transfer tokens to the caller (optional, depending on your implementation)
      const transferToCaller = buildTransferInstruction({
        from: THIS, // Transfer from the program's account
        to: from, // Transfer to the caller (registered user)
        tokenAddress: transaction.to, // Token address (assuming it's the same as the program's address)
        tokenIds: [] // Assuming no specific tokens are transferred
      });

      // Return outputs as JSON
      return new Outputs(computeInputs, [updateInstruction, transferToCaller]).toJson();
    } catch (e) {
      throw e;
    }
  }

  // Method to add a proposal (example cost: 5 tokens)
  addProposal(computeInputs: IComputeInputs) {
    try {
      const { transaction } = computeInputs;
      const { from } = transaction;
      const { proposalId, proposalDescription } = transaction.inputs as { proposalId: string, proposalDescription: string };

      const txInputs = parseTxInputs(computeInputs);
      const userData = JSON.parse(txInputs.data) as { tokens: number };

      if (userData.tokens < 5) { // Check if user has enough tokens
        throw new Error('Not enough tokens to create a proposal.');
      }

      const data = JSON.parse(txInputs.data) as { proposals: { [key: string]: { description: string, votes: number } }, votes: { [key: string]: string[] } };

      if (data.proposals[proposalId]) {
        throw new Error('Proposal with this ID already exists.');
      }

      data.proposals[proposalId] = {
        description: proposalDescription,
        votes: 0
      };

      // Deduct tokens for creating a proposal
      userData.tokens -= 5;

      const dataStr = validateAndCreateJsonString(data);

      const updateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'tokenUpdate',
          new TokenUpdate(
            new AddressOrNamespace(from), // User's address
            new AddressOrNamespace(THIS), // Program's address
            [
              buildTokenUpdateField({ field: 'data', value: dataStr, action: 'extend' }),
              buildTokenUpdateField({ field: 'data', value: JSON.stringify(userData), action: 'overwrite' }) // Update user's token balance
            ]
          )
        )
      });

      return new Outputs(computeInputs, [updateInstruction]).toJson();
    } catch (e) {
      throw e;
    }
  }

  // Method to cast a vote (example cost: 1 token)
  vote(computeInputs: IComputeInputs) {
    try {
      const { transaction } = computeInputs;
      const { from } = transaction;
      const { proposalId } = transaction.inputs as { proposalId: string };

      const txInputs = parseTxInputs(computeInputs);
      const userData = JSON.parse(txInputs.data) as { tokens: number };

      if (userData.tokens < 1) { // Check if user has enough tokens
        throw new Error('Not enough tokens to cast a vote.');
      }

      const data = JSON.parse(txInputs.data) as { proposals: { [key: string]: { description: string, votes: number } }, votes: { [key: string]: string[] } };

      if (!data.proposals[proposalId]) {
        throw new Error('Proposal does not exist.');
      }

      if (!data.votes[from]) {
        data.votes[from] = [];
      }

      if (data.votes[from].includes(proposalId)) {
        throw new Error('User has already voted for this proposal.');
      }

      data.proposals[proposalId].votes += 1;
      data.votes[from].push(proposalId);

      // Deduct tokens for casting a vote
      userData.tokens -= 1;

      const dataStr = validateAndCreateJsonString(data);

      const updateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'tokenUpdate',
          new TokenUpdate(
            new AddressOrNamespace(from), // User's address
            new AddressOrNamespace(THIS), // Program's address
            [
              buildTokenUpdateField({ field: 'data', value: dataStr, action: 'extend' }),
              buildTokenUpdateField({ field: 'data', value: JSON.stringify(userData), action: 'overwrite' }) // Update user's token balance
            ]
          )
        )
      });

      return new Outputs(computeInputs, [updateInstruction]).toJson();
    } catch (e) {
      throw e;
    }
  }

  // Method to tally votes
  tallyVotes(computeInputs: IComputeInputs) {
    try {
      const { transaction } = computeInputs;
      const { from } = transaction;

      const txInputs = parseTxInputs(computeInputs);
      const data: {
        results: { [key: string]: number; }, proposals: { [key: string]: { description: string, votes: number } }, votes: { [key: string]: string[] }
      } = JSON.parse(txInputs.data);

      const results: { [key: string]: number } = {};

      for (const proposalId in data.proposals) {
        results[proposalId] = data.proposals[proposalId].votes;
      }

      data.results = results; // Create a new property to store the results

      const dataStr = validateAndCreateJsonString(data);

      const updateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'tokenUpdate',
          new TokenUpdate(
            new AddressOrNamespace(THIS),
            new AddressOrNamespace(THIS),
            [buildTokenUpdateField({ field: 'data', value: dataStr, action: 'extend' })]
          )
        )
      });

      return new Outputs(computeInputs, [updateInstruction]).toJson();
    } catch (e) {
      throw e;
    }
  }
}
