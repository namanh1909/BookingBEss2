type IDoctor = {
  _id?: ObjectId;
  name: string;
  address?: string;
  gender?: string;
  about?: string;
  specialtyId?: string;
  experience?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  email: string;
  age?: string;
  createAt?: Date;
  updatedAt: Date;
};
