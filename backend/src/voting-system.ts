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
  THIS
} from '@versatus/versatus-javascript';

export class VotingProgram extends Program {
  // Initialize the voting program with proposals and votes storage
  create(computeInputs: IComputeInputs) {
    try {
      const { transaction } = computeInputs;
      const { from } = transaction;
      const txInputs = parseTxInputs(computeInputs);

      const initialData = {
        proposals: {},
        votes: {}
      };

      const dataStr = validateAndCreateJsonString(initialData);

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

  // Method to add a proposal
  addProposal(computeInputs: IComputeInputs) {
    try {
      const { transaction } = computeInputs;
      const { from } = transaction;
      const { proposalId, proposalDescription } = transaction.inputs as { proposalId: string, proposalDescription: string };

      const txInputs = parseTxInputs(computeInputs);
      const data = JSON.parse(txInputs.data) as { proposals: { [key: string]: { description: string, votes: number } }, votes: { [key: string]: string[] } };

      if (data.proposals[proposalId]) {
        throw new Error('Proposal with this ID already exists.');
      }

      data.proposals[proposalId] = {
        description: proposalDescription,
        votes: 0
      };

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

  // Method to cast a vote
  vote(computeInputs: IComputeInputs) {
    try {
      const { transaction } = computeInputs;
      const { from } = transaction;
      const { proposalId } = transaction.inputs as { proposalId: string };

      const txInputs = parseTxInputs(computeInputs);
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

  
  tallyVotes(computeInputs: IComputeInputs) {
    try {
      const { transaction } = computeInputs;
      const { from } = transaction;
  
      const txInputs = parseTxInputs(computeInputs);
      const data: {
        results: { [key: string]: number; }; proposals: { [key: string]: { description: string, votes: number } }, votes: { [key: string]: string[] } 
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
  }}