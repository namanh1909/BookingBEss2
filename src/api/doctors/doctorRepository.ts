import { ObjectId } from 'mongodb';

import { Doctor, DoctorType } from './doctorModel';

export const doctorRepository = {
  findAllAsync: async (): Promise<DoctorType[]> => {
    return Doctor.find();
  },

  findByIdAsync: async (id: string): Promise<DoctorType | null> => {
    return Doctor.findById(new ObjectId(id));
  },

  findByPaging: async (limit: number, page: number): Promise<any> => {
    const skipIndex = (page - 1) * limit;
    return Doctor.find().limit(limit).skip(skipIndex);
  },

  findByEmailAsync: async (email: string): Promise<DoctorType | null> => {
    return Doctor.findOne({ email });
  },

  createDoctorAsync: async (doctorData: IDoctor): Promise<IUser | any> => {
    const newDoctor = new Doctor(doctorData);
    return await newDoctor.save();
  },
  updateDoctorAsync: async (id: string, doctorData: IDoctor): Promise<DoctorType | null> => {
    return Doctor.findByIdAndUpdate(id, doctorData, { new: true });
  },
  findBySpecialtyIdAsync: async (specialtyId: string): Promise<DoctorType[]> => {
    return Doctor.find({ specialtyId });
  },
};
