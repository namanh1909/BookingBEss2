import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

import { userRepository } from '../user/userRepository';
import { DoctorType } from './doctorModel';
import { doctorRepository } from './doctorRepository';

export const doctorServices = {
  create: async (doctorData: IDoctor): Promise<ServiceResponse<any>> => {
    try {
      const checkEmailUserExited = await userRepository.findByEmailAsync(doctorData?.email);
      const checkEmailDoctorExited = await doctorRepository.findByEmailAsync(doctorData?.email);
      if (checkEmailDoctorExited || checkEmailUserExited) {
        return new ServiceResponse(ResponseStatus.Failed, 'Email already used', undefined, StatusCodes.NOT_FOUND);
      }
      const salt = await bcrypt.genSalt(10);

      const newDoctor = await doctorRepository.createDoctorAsync(doctorData);
      await userRepository.createUserAsync({
        IdDoctor: newDoctor?._id.toString(),
        name: newDoctor.name as string,
        Role: 'client-doctor',
        email: newDoctor.email as string,
        password: (await bcrypt.hash('asd123', salt)) as string,
      });
      console.log('newDoctor', newDoctor);
      return new ServiceResponse<any>(ResponseStatus.Success, 'Create doctor successfully', newDoctor, StatusCodes.OK);
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
  findAll: async (): Promise<ServiceResponse<DoctorType[] | undefined>> => {
    try {
      const allDoctors = await doctorRepository.findAllAsync();
      if (allDoctors) {
        return new ServiceResponse<DoctorType[]>(
          ResponseStatus.Success,
          'All doctors retrieved successfully',
          allDoctors,
          StatusCodes.OK
        );
      }
      return new ServiceResponse<DoctorType[]>(
        ResponseStatus.Failed,
        'Fetch doctor failed',
        allDoctors,
        StatusCodes.NOT_FOUND
      );
    } catch (ex) {
      const errorMessage = `Error while retrieving all doctors: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, undefined, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findById: async (id: string): Promise<ServiceResponse<DoctorType | undefined>> => {
    try {
      const doctor = await doctorRepository.findByIdAsync(id);
      if (!doctor) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', undefined, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<typeof doctor>(ResponseStatus.Success, 'User found', doctor, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, undefined, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  updateDoctor: async (id: string, doctorData: IDoctor): Promise<ServiceResponse<DoctorType | undefined>> => {
    try {
      const updatedDoctor = await doctorRepository.updateDoctorAsync(id, doctorData);
      if (!updatedDoctor) {
        return new ServiceResponse(ResponseStatus.Failed, 'Doctor not found', undefined, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<typeof updatedDoctor>(
        ResponseStatus.Success,
        'Doctor updated successfully',
        updatedDoctor,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error updating doctor with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, undefined, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  getDoctorsWithPaging: async (
    pagePayload: number,
    limitPayload: number
  ): Promise<ServiceResponse<DoctorType[] | undefined>> => {
    try {
      const page = pagePayload || 1;
      const limit = limitPayload || 5;
      const doctors = await doctorRepository.findByPaging(limit, page);
      return new ServiceResponse<typeof doctors>(ResponseStatus.Success, 'User found', doctors, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error while fetching doctors with paging: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, undefined, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  getBySpecialtyId: async (specialtyId: string): Promise<ServiceResponse<DoctorType[] | undefined>> => {
    try {
      const doctors = await doctorRepository.findBySpecialtyIdAsync(specialtyId);
      if (!doctors) {
        return new ServiceResponse<undefined>(ResponseStatus.Failed, 'Doctors found', undefined, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<typeof doctors>(ResponseStatus.Success, 'Doctors found', doctors, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding doctors with specialty id ${specialtyId}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, undefined, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
