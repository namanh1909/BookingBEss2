import mongoose from 'mongoose';

const { Schema } = mongoose;

export const LoginResponseSchema = new Schema({
  token: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

export const LoginRequestSchema = new Schema({
  email: { type: String, required: true, match: [/.+@.+\..+/, 'Please fill a valid email address'] },
  password: { type: String, required: true, minlength: 6 },
});

export const RegisterRequestSchema = new Schema({
  email: { type: String, required: true, match: [/.+@.+\..+/, 'Please fill a valid email address'] },
  password: { type: String, required: true, minlength: 6 },
  name: { type: String, required: true },
  confirmPassword: { type: String, required: true },
});

export const CheckAccountRequestSchema = new Schema({
  email: { type: String, required: true, match: [/.+@.+\..+/, 'Please fill a valid email address'] },
});

export const RefreshTokenRequestSchema = new Schema({
  email: { type: String, required: true, match: [/.+@.+\..+/, 'Please fill a valid email address'] },
});
