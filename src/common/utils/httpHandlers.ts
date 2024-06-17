import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import mongoose from 'mongoose';

import { ServiceResponse } from '@/common/models/serviceResponse';
import { ResponseStatus } from '@/enums';
import { logger } from '@/server';

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest =
  (schema?: mongoose.Schema<any> | any) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate JWT token
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
      logger.info(`Bearer Token: ${token}`);
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
        if (schema) {
          const validationResult = schema?.validate(req.body);
          if (validationResult.error) {
            throw validationResult.error;
          }
        }
        next();
      });
    } catch (err: any) {
      const errorMessage = `Invalid input: ${err.message}`;
      const statusCode = StatusCodes.BAD_REQUEST;
      res.status(statusCode).send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode));
    }
  };

export const getDecodedToken = (token: string) => {
  const decoded = jwtDecode<JwtPayload>(token as string);
  logger.info(`decoded: ${decoded}`);
  return decoded;
};
