addProposal(computeInputs, ComputeInputs) ;{
    try {
      const txInputs = parseTxInputs(computeInputs);
      const { proposalId, proposalText } = txInputs;
  
      const programAccountData = computeInputs.accountInfo.programAccountData;
      const currentData = JSON.parse(programAccountData?.data);
      const updatedProposals = {
        ...currentData.proposals,
        [proposalId]: { text: proposalText, votes: 0 }
      };
      const updatedData = { ...currentData, proposals: updatedProposals };
  
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
  