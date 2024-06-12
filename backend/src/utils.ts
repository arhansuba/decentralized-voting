import { IComputeInputs, validateAndCreateJsonString, parseTxInputs } from '@versatus/versatus-javascript';

export function parseAndValidateInputs(computeInputs: IComputeInputs, requiredFields: string[]): any {
  const txInputs = parseTxInputs(computeInputs);
  requiredFields.forEach(field => {
    if (!txInputs[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  });
  return txInputs;
}

export function constructJsonString(data: any): string {
  return validateAndCreateJsonString(data);
}

export function handleError(res: any, error: any) {
  console.error(error);
  res.status(500).json({ error: error.message });
}

export function successResponse(res: any, result: any) {
  res.json(result);
}
