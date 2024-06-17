import mongoose from 'mongoose';

import { ResponseStatus } from '@/enums';

export class ServiceResponse<T = null> {
  success: boolean;
  message: string;
  responseObject: T;
  statusCode: number;

  constructor(status: ResponseStatus, message: string, responseObject: T, statusCode: number) {
    this.success = status === ResponseStatus.Success;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
  }
}

export const serviceResponseSchema = new mongoose.Schema({
  success: { type: Boolean, required: true },
  message: { type: String, required: true },
  responseObject: { type: mongoose.Schema.Types.Mixed, required: false },
  statusCode: { type: Number, required: true },
});

export const ServiceResponseModel = mongoose.model('ServiceResponse', serviceResponseSchema);
