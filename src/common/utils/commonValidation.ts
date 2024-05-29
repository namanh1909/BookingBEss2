import { z } from 'zod';

export const commonValidations = {
  id: z.string(),
  email: z.string().email(),

  // ... other common validations
};
