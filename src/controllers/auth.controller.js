import * as authService from '../services/auth.service.js';
import { successResponse } from '../utils/response.js';

/**
 * Maneja el registro de un nuevo usuario.
 * @param {import('express').Request} req - Objeto de petición Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 */
export const register = async (req, res) => {
  const user = await authService.register(req.body);

  return successResponse(
    res,
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    'Usuario registrado',
    201
  );
};

/**
 * Maneja el inicio de sesión de un usuario.
 * @param {import('express').Request} req - Objeto de petición Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 */
export const login = async (req, res) => {
  const result = await authService.login(req.body.email, req.body.password);

  return successResponse(res, result, 'Inicio de sesión exitoso');
};
