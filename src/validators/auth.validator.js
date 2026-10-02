import { body } from 'express-validator';

export const registerValidator = [
  body('name').notEmpty().withMessage('El nombre es requerido'),

  body('email').isEmail().withMessage('Correo electrónico inválido'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener mínimo 6 caracteres'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Correo electrónico inválido'),

  body('password').notEmpty().withMessage('La contraseña es requerida'),
];
