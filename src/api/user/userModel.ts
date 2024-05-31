import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { model } from 'mongoose';
import { toMongooseSchema } from 'mongoose-zod';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export type UserType = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  Role: z.string().default(''),
  phoneNumber: z.string().default(''),
  Date: z.string().default(''),
  Gender: z.string().default(''),
  Avatar: z.string().default(''),
  age: z.string().default(''),
  createAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
  IdDoctor: z.string().default(''),
});

// Integrate the Zod schema with Mongoose
const userSchema = toMongooseSchema(UserSchema.mongoose());

export const User = model('User', userSchema);

export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const GetUserByTokenSchema = z.object({
  params: z.object({ token: z.string() }),
});

export const UpdateUserSchema = z.object({
  id: z.string(),
  dataUser: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    Role: z.string().optional(),
    phoneNumber: z.string().optional().nullable(),
    Date: z.string().optional().nullable(),
    Gender: z.string().optional().nullable(),
    Avatar: z.string().optional().nullable(),
    age: z.string().optional().nullable(),
    IdDoctor: z.string().optional().nullable(),
  }),
});
