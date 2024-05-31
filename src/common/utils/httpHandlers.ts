import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { ZodError, ZodSchema } from 'zod';

import { ServiceResponse } from '@/common/models/serviceResponse';
import { ResponseStatus } from '@/enums';

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(new ServiceResponse<null>(ResponseStatus.Failed, 'No token provided', null, StatusCodes.UNAUTHORIZED));
    }
    jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, decoded) => {
      if (err) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send(
            new ServiceResponse<null>(
              ResponseStatus.Failed,
              'Failed to authenticate token',
              null,
              StatusCodes.UNAUTHORIZED
            )
          );
      }
      (req as any).user = decoded; // Assuming decoded token is the user object
      // Validate request schema
      schema.parse({ body: req.body, query: req.query, params: req.params });
      next();
    });
  } catch (err) {
    const errorMessage = `Invalid input: ${(err as ZodError).errors.map((e) => e.message).join(', ')}`;
    const statusCode = StatusCodes.BAD_REQUEST;
    res.status(statusCode).send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode));
  }
};
