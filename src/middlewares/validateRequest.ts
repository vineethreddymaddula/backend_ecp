// src/middlewares/validateRequest.ts

import { Request, Response, NextFunction } from "express";
import { z } from "zod"; // We need 'z' for the 'z.Schema' type

const validateRequest =
  (
    schema: z.Schema // <-- The fix is here
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };

export default validateRequest;
