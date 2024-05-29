import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

import {
  CheckAccountRequestSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  RefreshTokenRequestSchema,
  RegisterRequestSchema,
} from './authModel';
import { authService } from './authService';

export const authRegistry = new OpenAPIRegistry();

export const authRouter: Router = (() => {
  const router = express.Router();

  authRegistry.registerPath({
    method: 'post',
    path: '/auth/login',
    tags: ['auth'],
    responses: createApiResponse(LoginResponseSchema, 'Success'),
    request: {
      body: {
        description: 'request login',
        required: true,
        content: {
          'application/json': {
            schema: LoginRequestSchema,
          },
        },
      },
    },
  });

  router.post('/login', async (_req: Request, res: Response) => {
    const serviceResponse = await authService.login(_req.body.email, _req.body.password);
    handleServiceResponse(serviceResponse, res);
  });

  authRegistry.registerPath({
    method: 'post',
    path: '/auth/register',
    tags: ['auth'],
    responses: createApiResponse(RegisterRequestSchema, 'Success'),
    request: {
      body: {
        description: 'request login',
        required: true,
        content: {
          'application/json': {
            schema: RegisterRequestSchema,
          },
        },
      },
    },
  });

  router.post('/register', async (_req: Request, res: Response) => {
    const { name, email, password, confirmPassword } = _req.body;
    const payload = { name, email, password, confirmPassword };
    const serviceResponse = await authService.register(payload);
    handleServiceResponse(serviceResponse, res);
  });

  authRegistry.registerPath({
    method: 'post',
    path: '/auth/loginWeb',
    tags: ['auth'],
    responses: createApiResponse(LoginRequestSchema, 'Success'),
    request: {
      body: {
        description: 'request login web',
        required: true,
        content: {
          'application/json': {
            schema: LoginRequestSchema,
          },
        },
      },
    },
  });

  router.post('/loginWeb', async (_req: Request, res: Response) => {
    const serviceResponse = await authService.loginWeb(_req.body.email, _req.body.password);
    handleServiceResponse(serviceResponse, res);
  });

  authRegistry.registerPath({
    method: 'post',
    path: '/auth/check-account-existed',
    tags: ['auth'],
    responses: createApiResponse(CheckAccountRequestSchema, 'Success'),
    request: {
      body: {
        description: 'check account login',
        required: true,
        content: {
          'application/json': {
            schema: CheckAccountRequestSchema,
          },
        },
      },
    },
  });

  router.post('/check-account-existed', async (_req: Request, res: Response) => {
    const serviceResponse = await authService.checkEmailExist(_req.body.email);
    handleServiceResponse(serviceResponse, res);
  });

  authRegistry.registerPath({
    method: 'post',
    path: '/auth/refreshToken',
    tags: ['auth'],
    responses: createApiResponse(RefreshTokenRequestSchema, 'Success'),
    request: {
      body: {
        description: 'refresh token',
        required: true,
        content: {
          'application/json': {
            schema: RefreshTokenRequestSchema,
          },
        },
      },
    },
  });

  router.post('/refreshToken', validateRequest(RefreshTokenRequestSchema), async (_req: Request, res: Response) => {
    const serviceResponse = await authService.generateRefreshToken(_req.body.userId);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
