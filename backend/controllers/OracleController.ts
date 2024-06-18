import { Request, Response } from 'express';
import OracleService from '../services/OracleService';

class OracleController {
  // Method to integrate with an external oracle
  public async integrateWithOracle(req: Request, res: Response): Promise<Response> {
    try {
      const { oracleId, data } = req.body;
      if (!oracleId || !data) {
        return res.status(400).json({ message: 'Oracle ID and data are required.' });
      }

      const response = await OracleService.integrateWithOracle(oracleId, data);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  // Method to fetch data from an external API
  public async fetchDataFromAPI(req: Request, res: Response): Promise<Response> {
    try {
      const { apiUrl } = req.body;
      if (!apiUrl) {
        return res.status(400).json({ message: 'API URL is required.' });
      }

      const data = await OracleService.fetchDataFromAPI(apiUrl);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
}

export default new OracleController();
