import { ObjectId } from 'mongodb';

import { User, UserType } from '@/api/user/userModel';

export const userRepository = {
  findAllAsync: async (): Promise<UserType[]> => {
    return User.find();
  },

  findByIdAsync: async (id: string): Promise<UserType | null> => {
    console.log('id', id);
    return User.findById(new ObjectId(id));
  },

  findByEmailAsync: async (email: string): Promise<UserType | null> => {
    return User.findOne({ email });
  },
};
