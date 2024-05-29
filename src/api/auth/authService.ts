import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { userRepository } from '@/api/user/userRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

import { User } from '../user/userModel';

export const authService = {
  login: async (email: string, password: string): Promise<ServiceResponse<ILoginResponse>> => {
    try {
      const user = (await userRepository.findByEmailAsync(email)) as IUser;

      if (!user) {
        return new ServiceResponse<ILoginResponse>(
          ResponseStatus.Failed,
          'Email or Password is not correct',
          undefined,
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return new ServiceResponse<ILoginResponse>(
          ResponseStatus.Failed,
          'Email or Password is not correct',
          undefined,
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1d' });
      const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '2d' });

      return new ServiceResponse<ILoginResponse>(
        ResponseStatus.Success,
        'Login successfully',
        {
          token,
          refreshToken,
        },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error during login: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse<ILoginResponse>(
        ResponseStatus.Failed,
        errorMessage,
        undefined,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  loginWeb: async (email: string, password: string): Promise<ServiceResponse<ILoginResponse>> => {
    try {
      const user = (await User.findOne({ email: email })) as IUser;
      if (!user) {
        return new ServiceResponse<ILoginResponse>(
          ResponseStatus.Failed,
          'Email or Password is not correct',
          undefined,
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      if (user.Role !== 'client-manager') {
        return new ServiceResponse<ILoginResponse>(
          ResponseStatus.Failed,
          'Email or Password is not correct',
          undefined,
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
        return new ServiceResponse<ILoginResponse>(
          ResponseStatus.Failed,
          'Email or Password is not correct',
          undefined,
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET || 'default_secret', { expiresIn: '1d' });
      const refreshToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET || 'default_secret', {
        expiresIn: '2d',
      });

      return new ServiceResponse<ILoginResponse>(
        ResponseStatus.Success,
        'Login successfully',
        {
          token,
          refreshToken,
        },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error during login: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse<ILoginResponse>(
        ResponseStatus.Failed,
        errorMessage,
        undefined,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  register: async (req: IRegisterRequest): Promise<ServiceResponse<typeof User | IRegisterResponse>> => {
    try {
      const { name, email, password, confirmPassword } = req;
      const checkEmailExist = await userRepository.findByEmailAsync(email);
      if (checkEmailExist) {
        return new ServiceResponse<IRegisterResponse>(
          ResponseStatus.Failed,
          'Email is already in use',
          undefined,
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      if (password !== confirmPassword) {
        return new ServiceResponse<IRegisterResponse>(
          ResponseStatus.Failed,
          'Passwords do not match',
          undefined,
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email,
        password: hashPassword,
        Role: 'client-user',
        createAt: new Date(),
        updatedAt: new Date(),
        phoneNumber: '',
        Date: '',
        Gender: '',
        Avatar: '',
        IdDoctor: '',
        age: '',
      });
      await user.save();
      return new ServiceResponse<any>(ResponseStatus.Success, 'User registered successfully', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error during registration: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse<IRegisterResponse>(
        ResponseStatus.Failed,
        errorMessage,
        undefined,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  checkEmailExist: async (email: string): Promise<ServiceResponse<ICheckAccountExited>> => {
    try {
      const checkEmailExist = await User.findOne({ email });
      if (checkEmailExist) {
        return new ServiceResponse<ICheckAccountExited>(
          ResponseStatus.Success,
          'Email exists',
          { isExited: true },
          StatusCodes.OK
        );
      } else {
        return new ServiceResponse<ICheckAccountExited>(
          ResponseStatus.Success,
          'Email does not exist',
          { isExited: false },
          StatusCodes.OK
        );
      }
    } catch (ex) {
      const errorMessage = `Error checking email existence: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse<any>(
        ResponseStatus.Failed,
        errorMessage,
        undefined,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  generateRefreshToken: async (userId: string): Promise<ServiceResponse<IRefreshTokenType>> => {
    try {
      const refreshToken = jwt.sign({ userId }, process.env.TOKEN_SECRET || 'default_secret', { expiresIn: '7d' });
      return new ServiceResponse<IRefreshTokenType>(
        ResponseStatus.Success,
        'Refresh token generated successfully',
        { refreshToken },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error generating refresh token: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse<undefined>(
        ResponseStatus.Failed,
        errorMessage,
        undefined,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
