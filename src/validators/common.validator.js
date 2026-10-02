import { param, body } from 'express-validator';

export const uuidParamValidator = [
  param('id').isUUID().withMessage('Formato de ID inválido'),
];

export const projectIdValidator = [
  param('projectId').isUUID().withMessage('Formato de projectId inválido'),
];
