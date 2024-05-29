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
  Role: z.string(),
  phoneNumber: z.string().optional().nullable(),
  Date: z.string().optional().nullable(),
  Gender: z.string().optional().nullable(),
  Avatar: z.string().optional().nullable(),
  IdDoctor: z.string().optional().nullable(),
  age: z.string().optional().nullable(),
  createAt: z.date().optional().nullable(),
  updatedAt: z.date().optional().nullable(),
});

// Integrate the Zod schema with Mongoose
const userSchema = toMongooseSchema(UserSchema.mongoose());

export const User = model('User', userSchema);

export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
