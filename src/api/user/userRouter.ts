import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { GetUserByTokenSchema, GetUserSchema, UpdateUserSchema, UserSchema } from '@/api/user/userModel';
import { userService } from '@/api/user/userService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

export const userRegistry = new OpenAPIRegistry();

userRegistry.register('User', UserSchema);

export const userRouter: Router = (() => {
  const router = express.Router();

  userRegistry.registerPath({
    method: 'get',
    path: '/users',
    tags: ['User'],
    responses: createApiResponse(z.array(UserSchema), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  userRegistry.registerPath({
    method: 'get',
    path: '/users/{id}',
    tags: ['User'],
    request: { params: GetUserSchema.shape.params },
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await userService.findById(id);
    handleServiceResponse(serviceResponse, res);
  });

  userRegistry.registerPath({
    method: 'post',
    path: '/users/update',
    tags: ['User'],
    responses: createApiResponse(UpdateUserSchema, 'Success'),
    request: {
      body: {
        description: 'Create a new doctor',
        required: true,
        content: {
          'application/json': {
            schema: UpdateUserSchema,
          },
        },
      },
    },
  });

  router.post('/update', async (req: Request, res: Response) => {
    const { id, dataUser } = req.body;
    const serviceResponse = await userService.updateInfo(id, dataUser);
    handleServiceResponse(serviceResponse, res);
  });

  userRegistry.registerPath({
    method: 'get',
    path: '/users/info',
    tags: ['User'],
    request: { params: GetUserByTokenSchema.shape.params },
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.get('/info', async (req: Request, res: Response) => {
    const token = req.headers.authorization?.replace('Bearer ', '') as string;
    const serviceResponse = await userService.findByToken(token);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
