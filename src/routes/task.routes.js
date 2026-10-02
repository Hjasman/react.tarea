import { Router } from 'express';

import * as taskController from '../controllers/task.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { projectIdValidator } from '../validators/common.validator.js';
import {
  createTaskValidator,
  taskIdValidator,
  updateTaskValidator,
} from '../validators/task.validator.js';

const router = Router();

/**
 * @swagger
 * /task/{projectId}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Obtener todas las tareas de un proyecto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de tareas
 */
router.get(
  '/:projectId',
  authenticate,
  projectIdValidator,
  validate,
  taskController.getAllTasks
);

/**
 * @swagger
 * /task/{projectId}:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Crear una nueva tarea en un proyecto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tarea creada
 */
router.post(
  '/:projectId',
  authenticate,
  projectIdValidator,
  createTaskValidator,
  validate,
  taskController.createTask
);

/**
 * @swagger
 * /task/{projectId}:
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Actualizar una tarea
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tarea actualizada
 */
router.patch(
  '/:projectId',
  authenticate,
  projectIdValidator,
  taskIdValidator,
  updateTaskValidator,
  validate,
  taskController.updateTask
);

/**
 * @swagger
 * /task/{projectId}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Eliminar una tarea
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Tarea eliminada
 */
router.delete(
  '/:projectId',
  authenticate,
  projectIdValidator,
  taskIdValidator,
  validate,
  taskController.deleteTask
);

/**
 * @swagger
 * /task/{projectId}/complete:
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Marcar una tarea como completada
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Tarea marcada como completada
 *       404:
 *         description: Tarea no encontrada
 */
router.patch(
  '/:projectId/complete',
  authenticate,
  projectIdValidator,
  taskIdValidator,
  validate,
  taskController.completeTask
);

/**
 * @swagger
 * /task/{projectId}/pending:
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Marcar una tarea como pendiente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Tarea marcada como pendiente
 *       404:
 *         description: Tarea no encontrada
 */
router.patch(
  '/:projectId/pending',
  authenticate,
  projectIdValidator,
  taskIdValidator,
  validate,
  taskController.pendingTask
);

export default router;
