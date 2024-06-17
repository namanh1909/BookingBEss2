import express, { Request, Response, Router } from 'express';

import { userService } from '@/api/user/userService';
import { getDecodedToken, handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';
import { logger } from '@/server';

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and operations
 */
export const userRouter: Router = (() => {
  const router = express.Router();

  /**
   * @openapi
   * /users/:
   *   get:
   *     tags:
   *       - User
   *     summary: Retrieve a list of users
   *     responses:
   *       200:
   *         description: A list of all users.
   *         content:
   *           application/json:
   *             schema:
   *                 $ref: './UserModal'
   */
  router.get('/', validateRequest(), async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  /**
   * @openapi
   * /users/{id}:
   *   get:
   *     tags:
   *       - User
   *     summary: Retrieve a single user by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Numeric ID of the user to retrieve.
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A single user.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: './UserModal'
   */
  router.get('/:id', validateRequest(), async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await userService.findById(id);
    handleServiceResponse(serviceResponse, res);
  });

  /**
   * @openapi
   * /users/update:
   *   post:
   *     tags:
   *       - User
   *     summary: Update a user's information
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *                 description: The user ID
   *               dataUser:
   *                 $ref: './UserModal'
   *     responses:
   *       200:
   *         description: User updated.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: './UserModal'
   */
  router.post('/update', validateRequest(), async (req: Request, res: Response) => {
    const { id, dataUser } = req.body;
    const serviceResponse = await userService.updateInfo(id, dataUser);
    handleServiceResponse(serviceResponse, res);
  });

  /**
   * @openapi
   * /users/info:
   *   get:
   *     tags:
   *       - User
   *     summary: Retrieve user information by token
   *     responses:
   *       200:
   *         description: User information retrieved.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: './UserModal'
   */
  router.get('/info', validateRequest(), async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    logger.info(`Bearer Token: ${token}`);
    const decoded = getDecodedToken(token as string);
    const serviceResponse = await userService.findById(decoded?.id);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
