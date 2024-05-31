import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { CreateDoctorRequestSchema, DoctorSchema, GetDoctorBySpecialtyIdSchema, GetDoctorSchema } from './doctorModel';
import { doctorServices } from './doctorService';

export const doctorRegistry = new OpenAPIRegistry();

doctorRegistry.register('Doctor', DoctorSchema);

export const doctorRouter: Router = (() => {
  const router = express.Router();

  doctorRegistry.registerPath({
    method: 'post',
    path: '/doctor',
    tags: ['Doctor'],
    responses: createApiResponse(CreateDoctorRequestSchema, 'Success'),
    request: {
      body: {
        description: 'Create a new doctor',
        required: true,
        content: {
          'application/json': {
            schema: CreateDoctorRequestSchema,
          },
        },
      },
    },
  });

  router.post('/', async (_req: Request, res: Response) => {
    const serviceResponse = await doctorServices.create(_req.body);
    handleServiceResponse(serviceResponse, res);
  });

  doctorRegistry.registerPath({
    method: 'get',
    path: '/doctor',
    tags: ['Doctor'],
    responses: createApiResponse(z.array(DoctorSchema), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await doctorServices.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  doctorRegistry.registerPath({
    method: 'get',
    path: '/doctor/{id}',
    tags: ['Doctor'],
    request: { params: GetDoctorSchema.shape.params },
    responses: createApiResponse(DoctorSchema, 'Success'),
  });

  router.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await doctorServices.findById(id);
    handleServiceResponse(serviceResponse, res);
  });

  doctorRegistry.registerPath({
    method: 'get',
    path: '/doctor/specialty/{specialtyId}',
    tags: ['Doctor'],
    request: { params: GetDoctorBySpecialtyIdSchema.shape.params },
    responses: createApiResponse(z.array(DoctorSchema), 'Success'),
  });

  router.get('/specialty/:specialtyId', async (req: Request, res: Response) => {
    const specialtyId = req.params.specialtyId;
    const serviceResponse = await doctorServices.getBySpecialtyId(specialtyId);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
