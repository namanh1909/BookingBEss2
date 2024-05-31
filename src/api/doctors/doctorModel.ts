import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { model } from 'mongoose';
import { toMongooseSchema } from 'mongoose-zod';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export type DoctorType = z.infer<typeof DoctorSchema>;
export const DoctorSchema = z.object({
  name: z.string(),
  address: z.string().optional().nullable(),
  about: z.string().optional().nullable(),
  specialtyId: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  experience: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  age: z.string().optional().nullable(),
  createAt: z.date().default(new Date()).nullable(),
  updatedAt: z.date().default(new Date()).nullable(),
});
// Integrate the Zod schema with Mongoose
const doctorSchema = toMongooseSchema(DoctorSchema.mongoose());

export const CreateDoctorRequestSchema = z.object({
  name: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  about: z.string().optional().nullable(),
  specialtyId: z.string().optional().nullable(),
  experience: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  age: z.string().optional().nullable(),
});

export const GetDoctorPagingRequestSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const Doctor = model('Doctor', doctorSchema);

export const GetDoctorSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const GetDoctorBySpecialtyIdSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
