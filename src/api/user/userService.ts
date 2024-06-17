import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

import { User, UserType } from '@/api/user/userModel';
import { userRepository } from '@/api/user/userRepository';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { ResponseStatus } from '@/enums';
import { logger } from '@/server';

export const userService = {
  // Retrieves all users from the database
  findAll: async (): Promise<ServiceResponse<UserType[] | undefined>> => {
    try {
      const users = await userRepository.findAllAsync();
      if (!users) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Users found', undefined, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<typeof users>(ResponseStatus.Success, 'Users found', users, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, undefined, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // Retrieves a single user by their ID
  findById: async (id: string): Promise<ServiceResponse<UserType | undefined>> => {
    try {
      const user = await userRepository.findByIdAsync(id);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', undefined, StatusCodes.NOT_FOUND);
      }

      return new ServiceResponse<typeof user>(ResponseStatus.Success, 'User found', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, undefined, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findByToken: async (token: string): Promise<ServiceResponse<UserType | undefined>> => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      logger.info('decoded', decoded?.id);

      if (decoded?.id) {
        const user = await User.findOne({ IdUser: decoded?.id });

        if (!user) {
          return new ServiceResponse(ResponseStatus.Failed, 'User not found', undefined, StatusCodes.NOT_FOUND);
        }
        return new ServiceResponse(ResponseStatus.Success, 'User found', user, StatusCodes.NOT_FOUND);
      }
      logger.info('error');

      return new ServiceResponse(ResponseStatus.Failed, 'User not found', undefined, StatusCodes.NOT_FOUND);
    } catch (ex) {
      const errorMessage = `Error finding user by token: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, undefined, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  updateInfo: async (id: string, userInfo: IUser): Promise<ServiceResponse<UserType | undefined>> => {
    try {
      const updatedUser = await userRepository.updateUserAsync(id, userInfo);
      if (!updatedUser) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', undefined, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<typeof updatedUser>(
        ResponseStatus.Success,
        'User info updated successfully',
        updatedUser,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error updating user info with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, undefined, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
