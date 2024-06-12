tallyVotes(computeInputs, ComputeInputs) ;{
    try {
      const programAccountData = computeInputs.accountInfo.programAccountData;
      const currentData = JSON.parse(programAccountData?.data);
  
      const results = Object.entries(currentData.proposals).map(([proposalId, proposal]) => ({
        proposalId,
        votes: proposal.votes
      }));
  
      return new Outputs(computeInputs, []).toJson({ results });
    } catch (e) {
      throw e;
    }
  }
  