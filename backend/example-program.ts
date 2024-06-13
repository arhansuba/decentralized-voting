import {
  buildBurnInstruction,
  buildCreateInstruction,
  buildMintInstructions,
  buildProgramUpdateField,
  buildTokenDistribution,
  buildTokenUpdateField,
  buildUpdateInstruction,
} from '@versatus/versatus-javascript'
import { THIS } from '@versatus/versatus-javascript'
import {
  Program,
  ProgramUpdate,
} from '@versatus/versatus-javascript'
import { AddressOrNamespace } from '@versatus/versatus-javascript'
import { TokenOrProgramUpdate } from '@versatus/versatus-javascript'
import { Outputs } from '@versatus/versatus-javascript'
import {
  checkIfValuesAreUndefined,
  formatAmountToHex,
  formatVerse,
  parseAmountToBigInt,
  validate,
  validateAndCreateJsonString,
} from '@versatus/versatus-javascript'
import { IComputeInputs } from '@versatus/versatus-javascript'
import { VotingProgram } from './src/voting-system'
// src/example-program.ts
//import {VotingProgram} from 'backend/src/voting-system';


// Initialize VotingProgram with a program balance of 1,000,000 VOTE tokens
const votingProgram = new VotingProgram(1000000);

// Example function to register a user and allocate tokens
function registerUser(userAddress: string) {
  const computeInputs = {
    transaction: {
      from: userAddress
    }
  };

  try {
    const outputs = votingProgram.register(computeInputs);
    console.log('User registered successfully:', outputs);
  } catch (error) {
    console.error('Error registering user:', error);
  }
}

// Example usage:
const userAddress = '0x1234567890abcdef'; // Replace with actual user address
registerUser(userAddress);

class FungibleTokenProgram extends Program {
  constructor() {
    super()
    this.registerContractMethod('burn', this.burn)
    this.registerContractMethod('create', this.create)
    this.registerContractMethod('mint', this.mint)
  }

  burn(computeInputs: IComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { from, programId, value } = transaction

      checkIfValuesAreUndefined({ from, programId, value })

      const burnInstruction = buildBurnInstruction({
        from: from,
        caller: from,
        programId: THIS,
        tokenAddress: programId,
        amount: value,
      })

      return new Outputs(computeInputs, [burnInstruction]).toJson()
    } catch (e) {
      throw e
    }
  }

  create(computeInputs: IComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { transactionInputs, from, to } = transaction
      const txInputs = validate(
        JSON.parse(transactionInputs),
        'unable to parse transactionInputs'
      )

      // metadata
      const totalSupply = txInputs?.totalSupply
      const initializedSupply = txInputs?.initializedSupply
      const symbol = txInputs?.symbol
      const name = txInputs?.name
      const recipientAddress = txInputs?.to ?? transaction.to
      const metadataStr = validateAndCreateJsonString({
        symbol,
        name,
        totalSupply: formatAmountToHex(totalSupply),
      })

      // data
      const imgUrl = txInputs?.imgUrl
      const paymentProgramAddress = txInputs?.paymentProgramAddress
      const conversionRate = txInputs?.conversionRate
      const methods = 'approve,create,burn,mint,update'
      const dataStr = validateAndCreateJsonString({
        type: 'fungible',
        imgUrl,
        paymentProgramAddress,
        conversionRate,
        methods,
      })

      const addTokenMetadata = buildTokenUpdateField({
        field: 'metadata',
        value: metadataStr,
        action: 'extend',
      })

      const addTokenData = buildTokenUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      const addProgramData = buildProgramUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      const distributionInstruction = buildTokenDistribution({
        programId: THIS,
        initializedSupply: formatAmountToHex(initializedSupply),
        to: recipientAddress ?? to,
        tokenUpdates: [addTokenMetadata, addTokenData],
      })

      const createAndDistributeInstruction = buildCreateInstruction({
        from,
        initializedSupply: formatAmountToHex(initializedSupply),
        totalSupply,
        programId: THIS,
        programOwner: from,
        programNamespace: THIS,
        distributionInstruction,
      })

      const addProgramMetadata = buildProgramUpdateField({
        field: 'metadata',
        value: metadataStr,
        action: 'extend',
      })

      const programUpdateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'programUpdate',
          new ProgramUpdate(new AddressOrNamespace(THIS), [
            addProgramMetadata,
            addProgramData,
          ])
        ),
      })

      return new Outputs(computeInputs, [
        createAndDistributeInstruction,
        programUpdateInstruction,
      ]).toJson()
    } catch (e) {
      throw e
    }
  }

  mint(computeInputs: IComputeInputs) {
    try {
      const { transaction } = computeInputs
      const currProgramInfo = validate(
        computeInputs.accountInfo?.programs[transaction.to],
        'token missing from self...'
      )

      const tokenData = validate(
        currProgramInfo?.data,
        'token missing required data to mint...'
      )

      const paymentProgramAddress = tokenData.paymentProgramAddress
      const inputValue = BigInt(transaction.value)
      const conversionRate = tokenData.conversionRate
      const returnedValue = BigInt(
        //@ts-ignore
        formatVerse(inputValue * parseAmountToBigInt(conversionRate.toString()))
      )

      checkIfValuesAreUndefined({
        paymentProgramAddress,
        inputValue,
        conversionRate,
        returnedValue,
      })

      const mintInstructions = buildMintInstructions({
        from: transaction.from,
        programId: transaction.programId,
        paymentTokenAddress: paymentProgramAddress,
        inputValue: inputValue,
        returnedValue: returnedValue,
      })

      return new Outputs(computeInputs, mintInstructions).toJson()
    } catch (e) {
      throw e
    }
  }
}

FungibleTokenProgram.run()
