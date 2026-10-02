import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { findById } from '../repositories/user.repository.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Se requiere token de autorización',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwt.secret);

    const user = await findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: 'Usuario no encontrado',
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }
};
