vote(computeInputs, ComputeInputs) ;{
    try {
      const txInputs = parseTxInputs(computeInputs);
      const { proposalId, voterAddress } = txInputs;
  
      const programAccountData = computeInputs.accountInfo.programAccountData;
      const currentData = JSON.parse(programAccountData?.data);
      const proposal = currentData.proposals[proposalId];
  
      if (!proposal) {
        throw new Error('Proposal not found');
      }
  
      const updatedVotes = { ...currentData.votes, [voterAddress]: proposalId };
      const updatedProposals = {
        ...currentData.proposals,
        [proposalId]: { ...proposal, votes: proposal.votes + 1 }
      };
      const updatedData = { ...currentData, proposals: updatedProposals, votes: updatedVotes };
  
      const dataStr = validateAndCreateJsonString(updatedData);
  
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
  