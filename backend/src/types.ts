export interface IAccount {
    accountType: { program: string };
    nonce: string;
    ownerAddress: string;
    programAccountData: Record<string, any>;
    programAccountMetadata: Record<string, any>;
    programAccountLinkedPrograms: string[];
  }
  
  export interface ITransaction {
    from: string;
    to: string;
    transactionInputs: string;
    nonce: string;
    op: string;
    programId: string;
    r: string;
    s: string;
    v: number;
    transactionType: { call: string };
    value: string;
  }
  
  export interface IComputeInputs {
    accountInfo: IAccount;
    contractInputs: Record<string, any>;
    op: string;
    version: number;
    transaction: ITransaction;
  }
  