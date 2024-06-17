import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';

import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

import { authService } from './authService';

export const authRegistry = new OpenAPIRegistry();

export const authRouter: Router = (() => {
  const router = express.Router();

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     tags:
   *       - Auth
   *     summary: User login
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: './authModel#LoginRequestSchema'
   *           example:
   *             email: "john.doe@example.com"
   *             password: "securePassword123"
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: './authModel'
   */
  router.post('/login', async (_req: Request, res: Response) => {
    const serviceResponse = await authService.login(_req.body.email, _req.body.password);
    handleServiceResponse(serviceResponse, res);
  });

  /**
   * @openapi
   * /auth/register:
   *   post:
   *     tags:
   *       - Auth
   *     summary: User registration
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: './authModel#RegisterRequestSchema'
   *           example:
   *             name: "John Doe"
   *             email: "john.doe@example.com"
   *             password: "securePassword123"
   *             confirmPassword: "securePassword123"
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: './authModel'
   */
  router.post('/register', async (_req: Request, res: Response) => {
    const { name, email, password, confirmPassword } = _req.body;
    const payload = { name, email, password, confirmPassword };
    const serviceResponse = await authService.register(payload);
    handleServiceResponse(serviceResponse, res);
  });

  /**
   * @openapi
   * /auth/loginWeb:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Web login
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: './authModel#LoginRequestSchema'
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: './authModel'
   */
  router.post('/loginWeb', async (_req: Request, res: Response) => {
    const serviceResponse = await authService.loginWeb(_req.body.email, _req.body.password);
    handleServiceResponse(serviceResponse, res);
  });

  /**
   * @openapi
   * /auth/check-account-existed:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Check if account exists
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: './authModel#CheckAccountRequestSchema'
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: './authModel'
   */
  router.post('/check-account-existed', async (_req: Request, res: Response) => {
    const serviceResponse = await authService.checkEmailExist(_req.body.email);
    handleServiceResponse(serviceResponse, res);
  });

  /**
   * @openapi
   * /auth/refreshToken:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Refresh authentication token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: './authModel#RefreshTokenRequestSchema'
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: './authModel'
   */
  router.post('/refreshToken', validateRequest(), async (_req: Request, res: Response) => {
    const serviceResponse = await authService.generateRefreshToken(_req.body.userId);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
