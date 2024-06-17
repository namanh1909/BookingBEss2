import mongoose from 'mongoose';
export interface UserType extends mongoose.Document {
  IdUser: string;
  name: string;
  email: string;
  password: string;
  Role: string;
  phoneNumber?: string;
  Date?: string;
  Gender?: string;
  Avatar?: string;
  age?: string;
  createAt?: Date;
  updatedAt?: Date;
  IdDoctor?: string;
}

const userSchema = new mongoose.Schema(
  {
    IdUser: {
      type: String,
      required: true,
      default: () => `User${new Date().getTime() + Math.random()}`,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    Role: { type: String, default: '' },
    phoneNumber: { type: String, default: '', optional: true },
    Date: { type: String, default: '', optional: true },
    Gender: { type: String, default: '', optional: true },
    Avatar: { type: String, default: '', optional: true },
    age: { type: String, default: '', optional: true },
    createAt: { type: Date, default: new Date(), optional: true },
    updatedAt: { type: Date, default: new Date(), optional: true },
    IdDoctor: { type: String, default: '', optional: true },
  },
  {
    timestamps: true,
  }
);

export const GetUser = {
  schema: {
    obj: {
      params: {
        id: { type: String, required: true },
      },
    },
  },
};

export const GetUserByToken = {
  schema: {
    obj: {
      params: {
        token: { type: String, required: true },
      },
    },
  },
};

export const UpdateUser = {
  schema: {
    obj: {
      body: {
        id: { type: String, required: true },
        dataUser: {
          type: Object,
          properties: {
            name: { type: String, required: false },
            email: { type: String, required: false },
            password: { type: String, required: false },
            Role: { type: String, required: false },
            phoneNumber: { type: String, required: false },
            Date: { type: String, required: false },
            Gender: { type: String, required: false },
            Avatar: { type: String, required: false },
            age: { type: String, required: false },
            createAt: { type: Date, required: false },
            updatedAt: { type: Date, required: false },
            IdDoctor: { type: String, required: false },
          },
        },
      },
    },
  },
};

export const User = mongoose.model<UserType>('User', userSchema);
