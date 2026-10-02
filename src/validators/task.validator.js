import { body } from 'express-validator';

export const createTaskValidator = [
  body('title')
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ max: 255 })
    .withMessage('El título debe tener menos de 255 caracteres'),

  body('description')
    .optional()
    .isString()
    .withMessage('La descripción debe ser un texto'),
];

export const taskIdValidator = [
  body('id')
    .notEmpty()
    .withMessage('El ID de la tarea es requerido')
    .isUUID()
    .withMessage('El ID de la tarea debe ser un UUID válido'),
];

export const updateTaskValidator = [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('El título no puede estar vacío')
    .isLength({ max: 255 })
    .withMessage('El título debe tener menos de 255 caracteres'),

  body('description')
    .optional()
    .isString()
    .withMessage('La descripción debe ser un texto'),
];
