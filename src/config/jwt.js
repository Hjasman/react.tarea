import jwt from 'jsonwebtoken';
import { env } from './env.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
};
