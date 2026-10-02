import bcrypt from 'bcrypt';

import * as userRepository from '../repositories/user.repository.js';
import { generateToken } from '../config/jwt.js';
import { AppError } from '../utils/AppError.js';

/**
 * Registra un nuevo usuario encriptando su contraseña.
 * @param {Object} data - Datos del usuario (nombre, email, password)
 * @returns {Promise<Object>} El usuario creado
 */
export const register = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    return await userRepository.create({
      ...data,
      password: hashedPassword,
    });
  } catch (error) {
    // Transformamos el error técnico de DB en un error de negocio
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new AppError('El correo ya está registrado', 409);
    }
    throw error;
  }
};

/**
 * Inicia sesión verificando las credenciales y genera un token JWT.
 * @param {string} email - Correo del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<Object>} Objeto con el token JWT y los datos del usuario
 */
export const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
